"use server";

export async function handleContactForm(formData) {
  // Extract data from the form
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const subjecttype = formData.get("subjecttype");
  const message = formData.get("message");

  // In a real app, you would save this to a database or send an email here
  console.log("Server received:", { name, email, subject, subjecttype, message });

  // Return a response to the client
  return {
    success: true,
    message: `Thanks ${name}, we received your message!`,
  };
}