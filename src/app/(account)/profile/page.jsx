"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  updateProfileApi,
  updateProfileImageApi,
  changePasswordApi,
  deleteAccountApi,
} from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Profile info state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [infoMsg, setInfoMsg] = useState({ type: "", text: "" });
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Image state
  const [imageUploading, setImageUploading] = useState(false);
  const [imageMsg, setImageMsg] = useState({ type: "", text: "" });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoMsg({ type: "", text: "" });
    setInfoSubmitting(true);

    try {
      const res = await updateProfileApi(formData);
      setUser(res.data.data);
      setInfoMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setInfoMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setInfoSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordSubmitting(true);

    try {
      await changePasswordApi(passwordData);
      setPasswordMsg({ type: "success", text: "Password changed successfully." });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMsg({ type: "", text: "" });
    setImageUploading(true);

    const form = new FormData();
    form.append("profileImage", file);

    try {
      const res = await updateProfileImageApi(form);
      setUser(res.data.user);
      setImageMsg({ type: "success", text: "Profile image updated." });
    } catch (err) {
      setImageMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to upload image.",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccountApi();
      await logout();
      router.push("/");
    } catch (err) {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-emerald-900">My Profile</h1>

      {/* Profile Image */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6">
        <div
          onClick={handleImageClick}
          className="relative w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center cursor-pointer overflow-hidden shrink-0"
        >
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-emerald-600">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
          {imageUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
              Uploading...
            </div>
          )}
        </div>

        <div>
          <p className="font-medium text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
          <button
            onClick={handleImageClick}
            className="text-sm text-emerald-700 font-medium hover:underline"
          >
            Change photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imageMsg.text && (
            <p
              className={`text-xs mt-1 ${
                imageMsg.type === "error" ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {imageMsg.text}
            </p>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-emerald-900 mb-4">
          Personal Information
        </h2>

        {infoMsg.text && (
          <p
            className={`text-sm rounded-lg px-3 py-2 mb-4 ${
              infoMsg.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {infoMsg.text}
          </p>
        )}

        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-pink-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInfoChange}
              required
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-pink-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInfoChange}
              required
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-pink-600 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInfoChange}
              placeholder="+91"
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={infoSubmitting}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {infoSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-emerald-900 mb-4">
          Change Password
        </h2>

        {passwordMsg.text && (
          <p
            className={`text-sm rounded-lg px-3 py-2 mb-4 ${
              passwordMsg.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {passwordMsg.text}
          </p>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSubmitting}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {passwordSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Delete Account
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          This will deactivate your account. This action cannot be undone from here.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 font-medium text-sm hover:underline"
          >
            Delete my account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700">Are you sure?</p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}