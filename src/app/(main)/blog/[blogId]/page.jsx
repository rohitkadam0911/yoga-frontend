"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogByIdApi, getAllBlogsApi } from "@/services/blog.service";

export default function BlogDetailPage() {
  const { blogId } = useParams();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogByIdApi(blogId);
        const currentBlog = res.data.data;

        setBlog(currentBlog);

        try {
          const allRes = await getAllBlogsApi();

          const related = allRes.data.data
            .filter(
              (b) =>
                b._id !== blogId &&
                b.category === currentBlog.category
            )
            .slice(0, 2);

          setRelatedBlogs(related);
        } catch (err) {
          setRelatedBlogs([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Article not found.");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="h-96 rounded-2xl bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error || "Article not found."}
        </p>

        <Link
          href="/blog"
          className="inline-block mt-4 text-emerald-700 hover:underline"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(blog.title);

  const facebookShareUrl =
    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const twitterShareUrl =
    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-emerald-50 text-center px-6 py-16 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-emerald-100/60"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-emerald-100/60"></div>

        <h1 className="relative text-3xl md:text-5xl font-bold text-emerald-900 max-w-3xl mx-auto leading-tight mb-4">
          {blog.title}
        </h1>

        <p className="relative text-gray-500 text-sm">
          {formatDate(blog.createdAt)} •{" "}
          {blog.authorId?.name || "YogaConnect"} • {blog.category}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[2fr_1fr] gap-12">
        {/* Main Content */}
        <article>
          {blog.thumbnail?.url && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={blog.thumbnail.url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {blog.description}
          </p>

          <div className="prose prose-emerald max-w-none whitespace-pre-line text-gray-700 leading-relaxed mb-10">
            {blog.content}
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 py-6 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Share this article:
            </span>

            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition"
            >
              FB
            </a>

            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition"
            >
              X
            </a>
          </div>

          {/* Author */}
          <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4 mt-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
              {blog.authorId?.profileImage?.url ? (
                <img
                  src={blog.authorId.profileImage.url}
                  alt={blog.authorId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-emerald-600">
                  {blog.authorId?.name?.[0]?.toUpperCase() || "A"}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-emerald-900">
                {blog.authorId?.name || "YogaConnect Team"}
              </h3>

              <p className="text-sm text-gray-500">
                {blog.authorId?.role === "instructor"
                  ? "Instructor at YogaConnect"
                  : "Contributor at YogaConnect"}
              </p>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Related Posts
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {relatedBlogs.map((related) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related._id}`}
                    className="group"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-emerald-100 mb-3">
                      {related.thumbnail?.url ? (
                        <img
                          src={related.thumbnail.url}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-500">
                          {related.category}
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-emerald-900 group-hover:text-emerald-600 line-clamp-2">
                      {related.title}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(related.createdAt)} •{" "}
                      {related.authorId?.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-10">
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">
              About
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Stories, practice tips, and wellness insights from the instructors
              and community behind YogaConnect.
            </p>
          </div>

          <div>
            <Link
              href="/blog"
              className="text-emerald-700 hover:underline font-medium"
            >
              ← Back to all articles
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}