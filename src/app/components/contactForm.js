// src/components/ContactForm.js
"use client";

import { handleContactForm } from "@/app/contact/actions";
import { useState } from "react";

export default function ContactForm() {
  const [feedback, setFeedback] = useState("");

  async function clientAction(formData) {
    // Calling the Server Action
    const result = await handleContactForm(formData);
    if (result.success) {
      setFeedback(result.message);
    }
  }

  return (
    
    <div className="contact-form">
    <form action={clientAction} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="row">
        <div className="col-md-6">
            <input name="name" type="text" placeholder="Name" required />
        </div>
        <div className="col-md-6">
            <input name="email" type="email" placeholder="Email" required />
        </div>
        <div className="col-md-6">
            <input name="subject" type="text" placeholder="Subject" required />
        </div>
        <div className="col-md-6">
        <select name="subjecttype" defaultValue="selectanychoose" required >
            <option value="selectanychoose" disabled >Select Subject Type</option>
            <option value="general">General Inquiry</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
        </select>
        </div>
        <div className="col-md-12">
            <textarea name="message" placeholder="Message" required />
        </div>
      
      <button className="btn" type="submit">
        Submit
      </button>

      {feedback && <p style={{ color: "blue" }}>{feedback}</p>}
        </div>
    </form>
    </div>
  );
}