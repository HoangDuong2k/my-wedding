"use client";

import type React from "react";

import PhotoAlbum from "@/components/PhotoAlbum";
import { CONFIGURATION } from "@/constants/configuration";
import { useParallax, useScrollEffects } from "@/hooks/use-scroll-effects";
import { Gift, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AudioWedding from "@/components/ui/audio-wedding";

export default function WeddingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [guestForm, setGuestForm] = useState({
    name: "",
    attendance: "yes",
    guestCount: "1",
    wishes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Scroll effects for different sections
  const coupleSection = useScrollEffects({ threshold: 0.2 });
  const storySection = useScrollEffects({ threshold: 0.1 });
  const giftSection = useScrollEffects({ threshold: 0.2 });
  const guestSection = useScrollEffects({ threshold: 0.2 });
  const thankYouSection = useScrollEffects({ threshold: 0.3 });

  // Parallax effects for background elements
  const storyParallax = useParallax(0.2);

  const carouselPhotos = [
    {
      src: "./carosel_1.jpg",
    },
    {
      src: "./carosel_3.jpg",
    },
    {
      src: "./carosel_4.jpg",
      style: {},
    },
    {
      src: "./carosel_5.jpg",
      // style: { objectPosition: "-70px top" },
      alt: "Khoảnh khắc 5",
    },
    {
      src: "./carosel_6.jpg",
      // style: { objectPosition: "center 0px" },
    },
    "./carosel_7.jpg",
    {
      src: "./carosel_8.jpg",
      // style: { objectPosition: "-200px top" },
    },
    {
      src: "./carosel_9.jpg",
      // style: { objectPosition: "-40px top" },
    },
    "./carosel_2.jpg",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const baseUrlEnv = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const baseUrl = baseUrlEnv.replace(/\/$/, "");

    const accepted = guestForm.attendance === "yes";

    // Gửi thông báo sang Telegram
    try {
      const telegramMessage = `
🎉 *Phản hồi mời cưới mới!*

👤 *Tên khách:* ${guestForm.name.trim()}
${accepted ? "✅ *Tham dự:* Có" : "❌ *Tham dự:* Không"}
${accepted ? `👥 *Số khách:* ${guestForm.guestCount}` : ""}
${guestForm.wishes?.trim() ? `💌 *Lời chúc:* ${guestForm.wishes.trim()}` : ""}

📅 *Thời gian:* ${new Date().toLocaleString("vi-VN")}
        `.trim();

      await fetch(`${baseUrl}/api/telegram/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: telegramMessage }),
      });

      setGuestForm({
        name: "",
        attendance: "yes",
        guestCount: "1",
        wishes: "",
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
    } catch (telegramError) {
      console.error("Failed to send Telegram notification:", telegramError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gift section helpers

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(CONFIGURATION.bankAccountNumber);
      console.log("Copied STK to clipboard");
    } catch (err) {
      console.error("Failed to copy STK", err);
    }
  };

  const downloadQrImage = () => {
    try {
      const link = document.createElement("a");
      link.href = CONFIGURATION.qr;
      link.download = "qr-thac-huy-vpbank.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 scroll-snap-y touch-action-pan-y">
      {/* Hero Banner Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden scroll-snap-start">
        {/* Background Images - Different for mobile and desktop */}
        <div className="absolute inset-0">
          {/* Desktop Background */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src="./banner_desktop.jpg"
              alt="Wedding couple"
              width={1905}
              height={605}
              quality={80}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mobile Background */}
          <div className="md:hidden absolute inset-0">
            <Image
              src="./banner_mobile.jpg"
              alt="Wedding couple mobile"
              className="w-full h-full object-cover"
              width={400}
              height={558}
              quality={80}
            />
          </div>
          {/* Overlay with gradient blur at bottom */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Bottom blur gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 w-full max-w-4xl mx-auto">
          {/* iOS-style frosted glass card */}
          <div className="backdrop-blur-[1px] bg-white/10 rounded-[2rem] md:max-h-[80vh] overflow-hidden p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl mx-4 sm:mx-6 md:mx-12 lg:mx-16 md:my-6">
            <div className="space-y-4 sm:space-y-6 md:space-y-5">
              <p className="text-base sm:text-lg md:text-xl font-quicksand font-light tracking-wide opacity-90">
                Save The Date
              </p>

              <div className="space-y-3 sm:space-y-4 md:space-y-4">
                {CONFIGURATION.groomFirst ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.groomName}
                    </h1>

                    <div className="text-xl sm:text-2xl md:text-3xl font-quicksand font-light">
                      &
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.brideName}
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.brideName}
                    </h1>

                    <div className="text-xl sm:text-2xl md:text-3xl font-quicksand font-light">
                      &
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.groomName}
                    </h1>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-white/30 my-6 sm:my-8 md:my-6"></div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="grid grid-cols-3 items-center text-xl sm:text-2xl">
                  <span className="font-quicksand font-medium text-right">
                    14:00
                  </span>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-quicksand font-light text-center">
                    28
                  </span>
                  <span className="font-quicksand font-medium text-left">
                    CHỦ NHẬT
                  </span>
                </div>
                <p className="text-lg sm:text-xl md:text-xl font-quicksand font-light text-center">
                  12 - 2025
                </p>
              </div>

              <div className="w-full h-px bg-white/30 my-6 sm:my-8 md:my-6"></div>

              <div className="space-y-2 sm:space-y-3 md:space-y-3">
                <p className="text-sm sm:text-base md:text-base font-quicksand font-medium">
                  Địa điểm tổ chức
                </p>
                <p className="text-xs sm:text-sm md:text-sm font-quicksand opacity-90 leading-relaxed">
                  Sau trường mầm non Tân Hội, cụm 4 Vĩnh Kỳ
                  <br />
                  xã Tân Hội, huyện Đan Phượng, TP Hà Nội
                </p>
              </div>

              {/* Action Icons */}
              <div className="flex justify-center gap-3 sm:gap-4 md:gap-5 pt-4 sm:pt-6 md:pt-0">
                <button
                  onClick={() =>
                    window.open(CONFIGURATION.mapUrl as string, "_blank")
                  }
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  onClick={() => scrollToSection("gift")}
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                >
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  onClick={() => scrollToSection("guest")}
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Couple Introduction Section */}
      <section
        ref={coupleSection.elementRef}
        className="py-20 px-6 scroll-snap-start"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              coupleSection.isVisible
                ? "animate-fadeInUp opacity-100"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4">
              Giới thiệu
            </h2>
            <p className="text-lg font-quicksand text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Gặp gỡ hai nhân vật chính của câu chuyện tình yêu này
            </p>
          </div>

          {/* Couple Photos - Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Groom */}
            <div
              className={`text-center transform transition-all duration-1000 ${
                coupleSection.isVisible
                  ? "animate-fadeInRight opacity-100 delay-400"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-full max-w-80 h-80 sm:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Image
                    src="the_groom_avatar.jpg"
                    alt="Thạc Huy - Groom"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "0 6px",
                      scale: "1.1",
                    }}
                    width={320}
                    height={384}
                    quality={80}
                  />
                </div>
                {/* iOS-style floating label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                    <p className="font-quicksand font-medium text-gray-800">
                      Chú rể
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-imperial-script text-gray-800 mb-4">
                Thạc Huy
              </h3>
              {/* <p className="font-quicksand text-gray-600 leading-relaxed max-w-sm mx-auto">
                A kind soul with a passion for life, bringing joy and laughter
                to every moment we share together.
              </p> */}
            </div>
            {/* Bride */}
            <div
              className={`text-center transform transition-all duration-1000 ${
                coupleSection.isVisible
                  ? "animate-fadeInLeft opacity-100 delay-200"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-full max-w-80 h-80 sm:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-pink-100">
                  <Image
                    src="the_bride_avatar.jpg"
                    alt="Thúy Mây - Bride"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "0 10px",
                      scale: "1.7",
                    }}
                    width={320}
                    height={384}
                    quality={80}
                  />
                </div>
                {/* iOS-style floating label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                    <p className="font-quicksand font-medium text-gray-800">
                      Cô dâu
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-imperial-script text-gray-800 mb-4">
                Thúy Mây
              </h3>
              {/* <p className="font-quicksand text-gray-600 leading-relaxed max-w-sm mx-auto">
                A beautiful heart with endless grace, making every day brighter
                with her love and warmth.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Love Story Section */}
      <section
        ref={storySection.elementRef}
        className="py-20 px-6 bg-[#f3d9dc] scroll-snap-start"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              storySection.isVisible
                ? "animate-bounceIn opacity-100"
                : "opacity-0 scale-95"
            }`}
          >
            <h2 className="text-5xl md:text-6xl mb-3 font-eb-garamond text-gray-800 tracking-wide">
              Cột Mốc Yêu Thương
            </h2>
            <p className="text-lg font-quicksand text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Lưu giữ những giây phút ngọt ngào trên hành trình yêu thương của
              chúng mình
            </p>
          </div>

          {/* Desktop layout with a centered vertical line */}
          <div className="relative hidden md:block">
            {/* Center vertical line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white"></div>

            {/* Top-left photo + caption on right */}
            <div className="absolute top-0 right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_1.jpg"
                  alt="Couple together"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={312}
                  height={320}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-30 left-1/2 translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Gặp nhau <br />
              <span className="italic">'Một chút rung động'</span>
            </p>

            {/* Middle-right photo + caption on left */}
            <div className="absolute top-[320px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_2.jpg"
                  alt="Graduation together"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={320}
                  height={384}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-[480px] right-1/2 -translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Du lịch đầu tiên <br />
              <span className="italic">'Gần nhau hơn'</span>
            </p>

            {/* Bottom-left photo + caption on right */}
            <div className="absolute top-[640px] right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_3.jpg"
                  alt="Couple traveling"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={320}
                  height={384}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-[800px] left-1/2 translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Lễ tốt nghiệp <br />
              <span className="italic">'Tự hào có nhau'</span>
            </p>

            {/* Fourth event - Cầu Hôn Lung Linh  */}
            <div className="absolute top-[950px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_4.jpg"
                  alt="Proposal moment"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={320}
                  height={384}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-[1100px] right-1/2 -translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Cầu hôn <br />
              <span className="italic">'Lời đồng ý trọn vẹn'</span>
            </p>

            {/* Fifth event - Dạm ngõ */}
            <div className="absolute top-[1270px] right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_5.jpg"
                  alt="Engagement ceremony"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={320}
                  height={384}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-[1430px] left-1/2 translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Dạm ngõ <br />
              <span className="italic">'Bắt đầu hành trình chung'</span>
            </p>

            {/* Sixth event - Về chung một nhà   */}
            <div className="absolute top-[1590px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_6.jpg"
                  alt="Moving in together"
                  className="w-full h-80 object-cover rounded-[24px]"
                  width={320}
                  height={384}
                  quality={90}
                />
              </div>
            </div>
            <p className="absolute top-[1740px] right-1/2 -translate-x-[20px] max-w-xs text-[#672b2b] text-xl font-quicksand font-light leading-relaxed text-center">
              Về chung nhà <br />
              <span className="italic">'Một đời bên nhau'</span>
            </p>

            {/* Spacer for desktop layout height to reveal absolutely positioned items */}
            <div className="h-[2000px]"></div>
          </div>

          {/* Mobile stacked layout */}
          <div className="md:hidden space-y-14">
            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_1.jpg"
                  alt="Couple together"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Gặp nhau <br />
                <span className="italic">'Một chút rung động'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_2.jpg"
                  alt="Graduation together"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Du lịch đầu tiên <br />
                <span className="italic">'Gần nhau hơn'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_3.jpg"
                  alt="Couple traveling"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Lễ tốt nghiệp <br />
                <span className="italic">'Tự hào có nhau'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_4.jpg"
                  alt="Proposal moment"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Cầu hôn <br />
                <span className="italic">'Lời đồng ý trọn vẹn'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_5.jpg"
                  alt="Engagement ceremony"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Dạm ngõ <br />
                <span className="italic">'Bắt đầu hành trình chung'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <Image
                  src="story_6.jpg"
                  alt="Moving in together"
                  className="w-full h-100 object-cover rounded-[24px]"
                  width={344}
                  height={400}
                  quality={90}
                />
              </div>
              <p className="text-lg font-quicksand text-[#672b2b] font-light leading-relaxed">
                Về chung nhà <br />
                <span className="italic">'Một đời bên nhau'</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Album Section */}
      <PhotoAlbum photos={carouselPhotos} />

      {/* Gift Section - Mừng Cưới */}
      <section
        ref={giftSection.elementRef}
        id="gift"
        className="py-20 px-6 bg-white scroll-snap-start"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              giftSection.isVisible
                ? "animate-scaleIn opacity-100"
                : "opacity-0 scale-90"
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-ballet text-[#8c4a4a] mb-6">
              Mừng Cưới
            </h2>
            <p className="text-gray-600 font-quicksand leading-relaxed max-w-2xl mx-auto">
              Mình rất muốn được chụp chung với bạn những tấm hình kỷ niệm vì
              vậy hãy đến sớm hơn một chút bạn yêu nhé! Đám cưới của chúng mình
              sẽ trọn vẹn hơn khi có thêm lời chúc phúc và sự hiện diện của các
              bạn.
            </p>
          </div>

          {/* QR + Bank info box */}
          <div className="mt-10 mx-auto max-w-xl border-2 border-dashed border-[#b77c7c] rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-rose-50/40">
            <button
              type="button"
              onClick={downloadQrImage}
              className="rounded-xl overflow-hidden shadow hover:shadow-md focus:outline-none"
              title="Bấm để tải ảnh QR"
            >
              <img
                src={CONFIGURATION.qr}
                alt="QR chuyển khoản"
                className="w-full h-full object-contain bg-white cursor-pointer"
              />
            </button>
            <div className="text-left space-y-2">
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">CTK:</span>{" "}
                {CONFIGURATION.bankAccountName}
              </p>
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">STK:</span>{" "}
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="underline decoration-dotted text-rose-700 hover:text-rose-800 cursor-pointer"
                  title="Bấm để copy STK"
                >
                  {CONFIGURATION.bankAccountNumber}
                </button>
              </p>
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">NH:</span>{" "}
                {CONFIGURATION.bankName}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600 font-quicksand">
            Bấm vào STK để copy hoặc bấm vào ảnh QR để lưu
          </p>
        </div>
      </section>

      {/* Guest Information Form Section */}
      <section
        ref={guestSection.elementRef}
        id="guest"
        className="py-20 px-6 bg-gradient-to-br from-rose-50 to-pink-50 scroll-snap-start"
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              guestSection.isVisible
                ? "animate-slideInFromBottom opacity-100"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4">
              Xác Nhận Tham Dự
            </h2>
            <p className="text-lg font-quicksand text-gray-600 leading-relaxed">
              Chúng tôi rất mong được chia sẻ niềm vui này cùng bạn
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50"
          >
            <div className="space-y-6">
              {/* Guest Name */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-2">
                  Tên khách mời *
                </label>
                <input
                  type="text"
                  required
                  value={guestForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-quicksand"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              {/* Attendance Confirmation */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-3">
                  Xác nhận tham dự *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={guestForm.attendance === "yes"}
                      onChange={(e) =>
                        handleFormChange("attendance", e.target.value)
                      }
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <span className="ml-3 font-quicksand text-gray-700">
                      Có, tôi sẽ tham dự
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={guestForm.attendance === "no"}
                      onChange={(e) =>
                        handleFormChange("attendance", e.target.value)
                      }
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <span className="ml-3 font-quicksand text-gray-700">
                      Xin lỗi, tôi bận mất rồi
                    </span>
                  </label>
                </div>
              </div>

              {/* Guest Count - Only show if attending */}
              {guestForm.attendance === "yes" && (
                <div>
                  <label className="block text-sm font-quicksand font-medium text-gray-700 mb-3">
                    Số lượng khách
                  </label>
                  <div className="flex gap-4">
                    {["1", "2", "3"].map((count) => (
                      <label key={count} className="flex items-center">
                        <input
                          type="radio"
                          name="guestCount"
                          value={count}
                          checked={guestForm.guestCount === count}
                          onChange={(e) =>
                            handleFormChange("guestCount", e.target.value)
                          }
                          className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                        />
                        <span className="ml-2 font-quicksand text-gray-700">
                          {count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishes */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-2">
                  Lời chúc
                </label>
                <textarea
                  value={guestForm.wishes}
                  onChange={(e) => handleFormChange("wishes", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none font-quicksand"
                  placeholder="Gửi lời chúc tốt đẹp đến cô dâu chú rể..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`${
                  submitSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : isSubmitting
                    ? "bg-rose-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                } w-full text-white font-quicksand font-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-5 w-5 rounded-full border-2 border-white/60 border-t-transparent animate-spin"></span>
                    <span>Đang gửi...</span>
                  </>
                ) : submitSuccess ? (
                  <span>Đã gửi thành công!</span>
                ) : (
                  <span>Gửi xác nhận</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* Thank You Section */}
      <section
        ref={thankYouSection.elementRef}
        id="thank-you"
        className="py-24 px-6 bg-white scroll-snap-start"
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative flex flex-col items-center transition-all duration-1000 ${
              thankYouSection.isVisible
                ? "animate-bounceIn opacity-100"
                : "opacity-0 scale-90"
            }`}
          >
            {/* Floral background frame */}
            <Image
              src="/thankyou_flower_background.png"
              alt="Floral frame"
              className="z-10 pointer-events-none select-none w-[400px] h-[600px] -top-[90px]  sm:w-[680px] sm:h-[830px] sm:-top-[140px] max-w-full absolute left-1/2 -translate-x-1/2"
              aria-hidden
              width={680}
              height={830}
              quality={90}
            />
            {/* Arched photo */}
            <div className="relative w-[300] h-[400px] rounded-[160px] sm:w-[380px] sm:h-[540px] sm:rounded-[180px]  overflow-hidden shadow-xl border-2 border-rose-300 bg-white">
              <Image
                src="/thankyou_bride_groom.jpg"
                alt="Bride and Groom"
                className="w-full h-full object-cover"
                width={376}
                height={536}
                quality={90}
              />
            </div>

            {/* Title */}
            <h3 className="mt-14 md:mt-18 text-[68px] leading-none md:text-[108px] font-eb-garamond text-[#7d4a4a] text-center">
              Thank you!
            </h3>
          </div>
        </div>
      </section>
      <section className="h-30"></section>
      {/* Music */}
      <AudioWedding />
    </div>
  );
}
