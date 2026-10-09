import React, { useState, useEffect } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Folder, 
  FolderPlus, 
  Grid, 
  List, 
  Eye, 
  Download, 
  Maximize2, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface MediaItem {
  key: string;
  size: number;
  lastModified: string;
  url: string;
  name: string;
}

const R2_BUCKET_DASHBOARD = "https://dash.cloudflare.com/1af3cf042ce92dccf6c10ecb81c0181b/r2/default/buckets/media";

const PRESET_FOLDERS = [
  { id: "all", label: "ทุกโฟลเดอร์ใน R2", prefix: "Alive_Model/", desc: "รวมภาพทุกกิจกรรมใน ALIVE Model" },
  { id: "reset", label: "🛑 Reset (หยุดวงจรเดิม)", prefix: "Alive_Model/REset/", desc: "ภาพกิจกรรมสะท้อนความตระหนักรู้ & ปรับสมดุล" },
  { id: "reconnect", label: "🤝 Reconnect (กลับมาเชื่อมกัน)", prefix: "Alive_Model/", filterKeyword: "reconnect", desc: "ภาพกิจกรรมเชื่อมสัมพันธ์ & Deep Listening" },
  { id: "recharge", label: "⚡ Recharge (เติมพลังชีวิต)", prefix: "Alive_Model/", filterKeyword: "recharge", desc: "ภาพกิจกรรมปลุกไฟ & เติมรอยยิ้ม" },
  { id: "reimagine", label: "💡 Reimagine (มองมุมใหม่)", prefix: "Alive_Model/reimagine/", desc: "ภาพกิจกรรม Design Thinking & Strategic Ideation" },
  { id: "recreate", label: "🌱 Recreate (ลงมือสร้างใหม่)", prefix: "Alive_Model/REcreate/", desc: "ภาพกิจกรรม Change Alliance & พันธสัญญาลงมือทำ" },
];

export default function AdminGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);

  // Upload States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [targetFolder, setTargetFolder] = useState<string>("Alive_Model/REset/");
  const [customFolder, setCustomFolder] = useState<string>("");
  const [customFilename, setCustomFilename] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete State
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const activeFolderObj = PRESET_FOLDERS.find(f => f.id === selectedFolder) || PRESET_FOLDERS[0];

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const targetPrefix = activeFolderObj.prefix;
      const res = await fetch(`/api/media?prefix=${encodeURIComponent(targetPrefix)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      let fetchedItems: MediaItem[] = data.items || [];
      
      // Filter by keyword if folder requires specific naming (e.g. reconnect or recharge in root Alive_Model/)
      if (activeFolderObj.filterKeyword) {
        const kw = activeFolderObj.filterKeyword.toLowerCase();
        fetchedItems = fetchedItems.filter(item => item.name.toLowerCase().includes(kw));
      }

      setItems(fetchedItems);
    } catch (err: any) {
      console.error("Fetch media error:", err);
      // Fallback with current known assets if API offline
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  // Handle Copy URL
  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle File Drop or Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setCustomFilename(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadStatus(null);

    const folderToUse = targetFolder === "custom" ? customFolder : targetFolder;

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", folderToUse);
      if (customFilename) {
        formData.append("filename", customFilename);
      }

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadStatus({
        type: "success",
        message: `อัปโหลดไฟล์ "${data.filename}" ขึ้น Cloudflare R2 สำเร็จเรียบร้อย!`,
      });

      // Clear Form
      setUploadFile(null);
      setUploadPreview(null);
      setCustomFilename("");

      // Refresh list
      fetchMedia();
    } catch (err: any) {
      setUploadStatus({
        type: "error",
        message: `เกิดข้อผิดพลาด: ${err.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ "${item.name}" ออกจาก Cloudflare R2?`)) return;

    setDeletingKey(item.key);
    try {
      const res = await fetch(`/api/media?key=${encodeURIComponent(item.key)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Delete failed");
      }

      setItems(prev => prev.filter(i => i.key !== item.key));
    } catch (err: any) {
      alert(`ลบไฟล์ไม่สำเร็จ: ${err.message}`);
    } finally {
      setDeletingKey(null);
    }
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filter items by search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Media & Gallery Manager"
      subtitle="อัปเดตและจัดการรูปภาพกิจกรรมการเรียนรู้บน Cloudflare R2 Bucket (media) แบบ Real-time"
    >
      <div className="space-y-8">
        
        {/* TOP STATUS BAR & CLOUDFLARE LINK */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Cloudflare R2 Storage Connected
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ระบบจัดการรูปภาพ & แกลเลอรี ALIVE Model
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              รูปภาพทั้งหมดถูกจัดเก็บและสตรีมผ่าน Cloudflare Global CDN ความเร็วสูง รองรับการแบ่งหมวดหมู่ตาม 5 สภาวะแห่งการเรียนรู้ (RESET, RECONNECT, RECHARGE, REIMAGINE, RECREATE)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <a
              href={R2_BUCKET_DASHBOARD}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-purple-500/30"
            >
              <span>เปิด R2 Bucket บน Cloudflare</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              onClick={fetchMedia}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center cursor-pointer"
              title="รีเฟรชรายการไฟล์"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* SECTION 1: UPLOAD NEW IMAGE ACCORDION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200/60 flex items-center justify-center text-brand-pink">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">อัปโหลดรูปภาพใหม่เข้าสู่ Cloudflare R2</h3>
              <p className="text-xs text-slate-500">เลือกโฟลเดอร์สภาวะที่ต้องการ และอัปโหลดไฟล์รูปภาพ (JPG, PNG, WEBP)</p>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* File Drop Area */}
              <div className="md:col-span-6 flex flex-col">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. เลือกไฟล์รูปภาพ <span className="text-pink-500">*</span>
                </label>
                
                <div className="relative border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-purple-50/30 transition-all flex-1 min-h-[180px] cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {uploadPreview ? (
                    <div className="relative w-full h-36 flex items-center justify-center rounded-xl overflow-hidden bg-black/5">
                      <img src={uploadPreview} alt="Preview" className="h-full object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadFile(null);
                          setUploadPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-purple-600 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">ลากไฟล์รูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                      <p className="text-[11px] text-slate-400">รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 20MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Target Folder & Filename Settings */}
              <div className="md:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. โฟลเดอร์ปลายทางใน R2 (ตามสภาวะ) <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={targetFolder}
                    onChange={(e) => setTargetFolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-colors font-medium appearance-none"
                  >
                    <option value="Alive_Model/REset/">🛑 Alive_Model/REset/ (หมวด Reset - หยุดวงจรเดิม)</option>
                    <option value="Alive_Model/">🤝 Alive_Model/ (หมวด Reconnect & Recharge)</option>
                    <option value="Alive_Model/reimagine/">💡 Alive_Model/reimagine/ (หมวด Reimagine - มองมุมใหม่)</option>
                    <option value="Alive_Model/REcreate/">🌱 Alive_Model/REcreate/ (หมวด Recreate - ลงมือสร้างใหม่)</option>
                    <option value="custom">📁 กำหนดโฟลเดอร์เอง (Custom Folder Path)</option>
                  </select>
                </div>

                {targetFolder === "custom" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ระบุ Folder Path
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น Alive_Model/workshops/"
                      value={customFolder}
                      onChange={(e) => setCustomFolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. ชื่อไฟล์ใน R2 (Filename)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น workshop_day1.jpg"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">หากไม่ระบุ จะใช้ชื่อไฟล์เดิมอัตโนมัติ</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!uploadFile || isUploading}
                    className="w-full py-3.5 rounded-xl bg-brand-pink hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>กำลังอัปโหลดขึ้น Cloudflare R2...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>อัปโหลดรูปภาพเข้า Cloudflare R2</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Status Message */}
            {uploadStatus && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
                uploadStatus.type === "success" 
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                {uploadStatus.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </form>
        </div>

        {/* SECTION 2: FOLDER SELECTOR & EXPLORER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900">สำรวจคลังรูปภาพใน R2 ({items.length} รายการ)</h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeFolderObj.desc}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อไฟล์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white text-xs outline-none transition-colors"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "grid" ? "bg-white text-purple-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "list" ? "bg-white text-purple-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Folder Filter Badges */}
          <div className="flex flex-wrap gap-2">
            {PRESET_FOLDERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFolder(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedFolder === f.id
                    ? "bg-purple-900 text-white shadow-md scale-105"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${selectedFolder === f.id ? "text-pink-400" : "text-slate-400"}`} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Media Items Display */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">กำลังโหลดรายการไฟล์จาก Cloudflare R2...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">ไม่พบรูปภาพในโฟลเดอร์นี้</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                คุณสามารถอัปโหลดรูปภาพใหม่ผ่านฟอร์มด้านบน หรือเปิดดูโฟลเดอร์อื่นได้ทันที
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.key}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div 
                      onClick={() => setPreviewImage(item)}
                      className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                        <span className="p-2 rounded-full bg-white/20 backdrop-blur-xs hover:bg-white/30 transition-colors">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="p-3.5 space-y-1">
                      <h4 className="font-bold text-xs text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {formatBytes(item.size)} {item.lastModified ? `• ${new Date(item.lastModified).toLocaleDateString("th-TH")}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.url, item.key)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-slate-700 hover:text-purple-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      title="คัดลอก URL ของรูปภาพ"
                    >
                      {copiedKey === item.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-colors"
                      title="เปิดดูรูปเต็ม"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      disabled={deletingKey === item.key}
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 cursor-pointer"
                      title="ลบออกจาก R2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">รูปภาพ</th>
                    <th className="py-3.5 px-4">ชื่อไฟล์</th>
                    <th className="py-3.5 px-4">ขนาด</th>
                    <th className="py-3.5 px-4">URL สาธารณะ</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4">
                        <div 
                          onClick={() => setPreviewImage(item)}
                          className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden cursor-pointer"
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">
                        {item.name}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal truncate max-w-xs">{item.key}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{formatBytes(item.size)}</td>
                      <td className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.url, item.key)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-700 font-mono text-[11px] transition-colors"
                        >
                          {copiedKey === item.key ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span className="truncate max-w-[200px]">{item.url}</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="เปิดดู"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            disabled={deletingKey === item.key}
                            onClick={() => handleDelete(item)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl bg-black"
            />

            <div className="mt-4 text-center text-white space-y-2">
              <h3 className="font-bold text-base">{previewImage.name}</h3>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewImage.url, previewImage.key)}
                  className="px-4 py-1.5 rounded-pill bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  {copiedKey === previewImage.key ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === previewImage.key ? "คัดลอกเรียบร้อย" : "Copy CDN Link"}</span>
                </button>
                <a
                  href={previewImage.url}
                  download={previewImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-pill bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
