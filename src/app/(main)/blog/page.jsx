"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { getAllBlogsApi } from "@/services/blog.service";

const CATEGORIES = ["Yoga", "Meditation", "Fitness", "Health", "Lifestyle"];
const POSTS_PER_PAGE = 4;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const blogListRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogsApi();
        setBlogs(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);
useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [page]);

  const filteredBlogs = useMemo(() => {
    if (category === "All") return blogs;
    return blogs.filter((b) => b.category === category);
  }, [blogs, category]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / POSTS_PER_PAGE));

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, page]);

  const recentBlogs = useMemo(() => blogs.slice(0, 3), [blogs]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((c) => {
      counts[c] = blogs.filter((b) => b.category === c).length;
    });
    return counts;
  }, [blogs]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleCategoryClick = (c) => {
    setCategory(c);
    setPage(1);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-emerald-50 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-emerald-100/60" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-emerald-100/60" />
        <p className="relative text-emerald-600 font-medium mb-2">From the mat</p>
        <h1 className="relative text-4xl md:text-6xl font-bold text-emerald-900 mb-3">
          The YogaConnect Blog
        </h1>
        <p className="relative text-gray-500">
          Practice tips, wellness insights, and stories from our instructors
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[2fr_1fr] gap-12">
        {/* Main feed */}
<div ref={blogListRef}>
          {loading && (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-96 bg-gray-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
              {error}
            </p>
          )}

          {!loading && !error && paginatedBlogs.length === 0 && (
            <p className="text-gray-500 py-16">No articles in this category yet.</p>
          )}

          {!loading && !error && paginatedBlogs.length > 0 && (
            <div className="space-y-10">
              {paginatedBlogs.map((blog) => (
                <article key={blog._id} className="border-b border-gray-100 pb-10 last:border-0">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 mb-5">
                    {blog.thumbnail?.url ? (
                      <img
                        src={blog.thumbnail.url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-400 text-sm">
                        {blog.category}
                      </div>
                    )}
                    <span className="absolute bottom-4 left-4 bg-white text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <span className="font-medium text-gray-600">
                      {blog.authorId?.name || "YogaConnect"}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-600">{blog.category}</span>
                  </div>

                  <Link href={`/blog/${blog._id}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 hover:text-emerald-600 transition mb-3">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {blog.description}
                  </p>

                  <Link
                    href={`/blog/${blog._id}`}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Read More
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                    page === p
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">
              Stories, practice tips, and wellness insights from the
              instructors and community behind YogaConnect.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Recent Articles
            </h3>
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog._id}`}
                  className="flex gap-3 group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-emerald-100 shrink-0">
                    {blog.thumbnail?.url ? (
                      <img
                        src={blog.thumbnail.url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-400 text-xs">
                        {blog.category}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900 group-hover:text-emerald-600 transition line-clamp-2 mb-1">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(blog.createdAt)} · {blog.authorId?.name || "YogaConnect"}
                    </p>
                  </div>
                </Link>
              ))}
              {recentBlogs.length === 0 && (
                <p className="text-sm text-gray-400">No articles yet.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Post Categories
            </h3>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => handleCategoryClick("All")}
                className={`w-full flex items-center justify-between py-3 text-sm font-medium transition ${
                  category === "All" ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>›</span> All
                </span>
                <span className="text-gray-400">{blogs.length}</span>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryClick(c)}
                  className={`w-full flex items-center justify-between py-3 text-sm font-medium transition ${
                    category === c ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>›</span> {c}
                  </span>
                  <span className="text-gray-400">{categoryCounts[c]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}