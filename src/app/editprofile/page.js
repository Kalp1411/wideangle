"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FaHome, FaPowerOff, FaBookmark, FaTicketAlt,
  FaCamera, FaPhone, FaEnvelope, FaCheck, FaUserAlt, FaMobileAlt,
  FaStar,
  FaUser,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getUserProfile, updateUserProfile } from '@/store/authSlice';
import { useLogoutConfirm } from '@/app/components/LogoutConfirmModal';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),

  email: z
    .string()
    .email('Enter a valid email address'),

  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) =>
        value == null ||
        value === '' ||
        /^\+?[0-9\s\-()]{7,15}$/.test(value),
      {
        message: 'Enter a valid phone number',
      }
    ),
});

const EditProfile = () => {
  const fileRef = useRef(null);
  const user = useAuth();
  const showLogoutConfirm = useLogoutConfirm();
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Show preview immediately
  const previewUrl = URL.createObjectURL(file);
  setAvatar(previewUrl);

  const formData = new FormData();
  formData.append('profile_image', file);

  try {
    setUploading(true);

    const res = await dispatch(
      updateUserProfile(formData)
    ).unwrap();

    // Update image with URL returned by API
    if (res?.profile_image) {
      setAvatar(res.profile_image);
    }
    await dispatch(getUserProfile());
    toast.success('Profile photo updated successfully!');
  } catch (error) {
    console.error('Profile photo upload failed:', error);

    // Restore previous image if upload fails
    setAvatar(profile?.profile_image || null);

    toast.error('Failed to upload profile photo');
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await dispatch(getUserProfile()).unwrap();
        setProfile({
          name: res.name || '',
          email: res.email || '',
          phone: res.phone || '',
        });
        reset({
          name: res.name || '',
          email: res.email || '',
          phone: res.phone || '',
        });
        setAvatar(res.profile_image?.profile_image || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  // const onSubmit = async (data) => {
  //   const userData = {
  //     name: data.name,
  //     email: data.email,
  //     phone: data.phone,
  //   };
  //   try {
  //     const res = await dispatch(updateUserProfile(userData)).unwrap();
  //     setProfile({
  //         name: data.name || '',
  //         email: data.email || '',
  //         phone: data.phone || '',
  //       });
  //     toast.success('Profile updated successfully!');
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     toast.error('Failed to save profile. Please try again.');
  //     return;
  //   }
  // };

  const onSubmit = async (data) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone || '');

  if (avatarFile) {
    formData.append('profile_image', avatarFile);
  }

  try {
    await dispatch(updateUserProfile(formData)).unwrap();
    await dispatch(getUserProfile());
    setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        
    toast.success('Profile updated successfully!');
  } catch (error) {
    toast.error('Failed to save profile');
  }
};

  const initials = profile.name ? profile.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join(''): '';

  return (
    <>
      <div className="dashboardarea pt-130 bg-[#0a0b0d]">
              <div className="container full__width__padding">
                <div className="row">
                  <div className="col-xl-12 pr-0">
                    <div className="dashboardarea__wraper">
                      <div className="dashboardarea__img">
                        <div className="dashboardarea__inner student__dashboard__inner">
                          <div className="dashboardarea__left">
                            <div className="dashboardarea__left__img">                        
                         {user?.profile_image?.profile_image ? (
                            <Image
                              src={user.profile_image.profile_image}
                              alt={user?.name || "Avatar"}
                              width={100}
                              height={100}
                              className="object-cover rounded-lg shadow-lg"
                              unoptimized
                            />
                          ) : (
                            <div className="prof-avatar-placeholder border-4">
                              <span>
                                {user?.name
                                  ?.split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase() || "KP"}
                              </span>
                            </div>
                          )}
                            </div>
                            <div className="dashboardarea__left__content">
                              <h4>Hi, {user?.name}</h4>
                              <p>Here's a quick overview of your account and activities.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      <div className="dashboard pt-20 pb-80">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-3 col-md-12">
              <div className="dashboard__inner p-4">
                <div className="dashboard__nav">
                  <ul>
                    <li>
                      <Link
                        className="d-flex align-items-center justify-cotent-center"
                        href="/dashboard"
                      >
                        <FaHome className="mr-2" size={16} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/editprofile"
                        className="active d-flex align-items-center gap-2"
                      >
                        <FaUser size={15} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mytickets"
                        className="d-flex align-items-center gap-2"
                      >
                        <FaTicketAlt size={14} /> My Tickets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/loyaltyprogram"
                        className="d-flex align-items-center justify-cotent-center"
                      >
                        <FaStar className="mr-2" size={16} />
                        Loyalty Program
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        onClick={showLogoutConfirm}
                        className="d-flex align-items-center justify-cotent-center"
                      >
                        <FaPowerOff className="mr-2" size={16} /> Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-xl-9 col-lg-9 col-md-12 dashboard__content_box">

              {/* Avatar */}
              <div className="prof-avatar-section">
                <div className="prof-avatar-wrap" onClick={() => fileRef.current.click()}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="prof-avatar-img" />
                  ) : (
                    <div className="prof-avatar-placeholder">
                      <span>{initials}</span>
                    </div>
                  )}
                  <div className="prof-avatar-overlay">
                    <FaCamera size={20} />
                    <span>Change Photo</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </div>
                <div className="prof-avatar-meta">
                  <h3 className="prof-display-name">{profile.name}</h3>
                  <p className="prof-display-email">{profile.email}</p>
                  <span className="prof-display-badge">
                    <FaMobileAlt size={10} /> Verified Member
                  </span>
                </div>
              </div>

              {/* Account Details */}
              <div className="prof-card">
                <div className="prof-card-head">
                  <h5 className="prof-card-title">Account Details</h5>
                </div>
                <div className="prof-account-grid">
                  <div className="prof-account-item">
                    <div className="prof-account-icon-wrap prof-account-icon-wrap--phone">
                      <FaPhone size={14} />
                    </div>
                    <div>
                      <p className="prof-account-label">Mobile Number</p>
                      <p className="prof-account-value">{profile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="prof-account-item">
                    <div className="prof-account-icon-wrap prof-account-icon-wrap--email">
                      <FaEnvelope size={14} />
                    </div>
                    <div>
                      <p className="prof-account-label">Email Address</p>
                      <p className="prof-account-value">{profile.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="prof-card prof-card--last">
                <div className="prof-card-head">
                  <h5 className="prof-card-title">Edit Profile</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="prof-form-grid">
                    <div className="prof-field prof-field--full">
                      <label className="prof-label">Full Name</label>
                      <input
                        className={`prof-input${errors.name ? ' prof-input--error' : ''}`}
                        placeholder="Full Name"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="prof-error text-danger">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="prof-field">
                      <label className="prof-label">Email Address</label>
                      <input
                        className={`prof-input${errors.email ? ' prof-input--error' : ''}`}
                        type="email"
                        placeholder="Email Address"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="prof-error text-danger">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="prof-field">
                      <label className="prof-label">Phone Number</label>
                      <input
                        className={`prof-input${errors.phone ? ' prof-input--error' : ''}`}
                        type="tel"
                        placeholder="Phone Number"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="prof-error text-danger">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="prof-form-foot">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`prof-save-btn${saved ? ' prof-save-btn--done' : ''}`}
                    >
                      {saved
                        ? <><FaCheck size={13} /> Saved!</>
                        : isSubmitting
                          ? 'Saving…'
                          : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
