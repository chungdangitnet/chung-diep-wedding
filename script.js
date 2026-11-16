document.addEventListener("DOMContentLoaded", () => {
  // ================= KHAI BÁO CÁC PHẦN TỬ CHÍNH =================
  const introScreen = document.getElementById("intro-screen");
  const mainContent = document.getElementById("main-content");
  const openBtn = document.getElementById("open-card-btn");
  const floatingContainer = document.getElementById("floating-hy-container");
  const hyTransition = document.getElementById("hy-transition-overlay");

  const bgMusic = document.getElementById("bgMusic");
  const openCardSfx = document.getElementById("openCardSfx");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const musicIconOn = document.getElementById("musicIconOn");
  const musicIconOff = document.getElementById("musicIconOff");

  // ================= 1. ÂM THANH (SOUND EFFECT & NHẠC NỀN) =================
  let isMusicPlaying = false;

  function playOpenCardSoundEffect() {
    if (openCardSfx && openCardSfx.getAttribute("src")) {
      openCardSfx.currentTime = 0;
      openCardSfx.volume = 0.85;
      openCardSfx.play().catch(() => {});
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [1046.5, 1318.5, 1568.0, 1975.5, 2349.3];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(
          0.14,
          ctx.currentTime + index * 0.06 + 0.03,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + index * 0.06 + 0.8,
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.06);
        osc.stop(ctx.currentTime + index * 0.06 + 0.85);
      });
    } catch (e) {}
  }

  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    if (!musicToggleBtn) return;

    if (playing) {
      musicToggleBtn.classList.add("playing");
      if (musicIconOn) musicIconOn.style.display = "block";
      if (musicIconOff) musicIconOff.style.display = "none";
    } else {
      musicToggleBtn.classList.remove("playing");
      if (musicIconOn) musicIconOn.style.display = "none";
      if (musicIconOff) musicIconOff.style.display = "block";
    }
  }

  function playWeddingMusic() {
    if (!bgMusic || isMusicPlaying) return;
    bgMusic.volume = 0.7;
    bgMusic
      .play()
      .then(() => updateMusicUI(true))
      .catch(() => updateMusicUI(false));
  }

  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        bgMusic.pause();
        updateMusicUI(false);
      } else {
        playWeddingMusic();
      }
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (!bgMusic) return;
    if (document.hidden && isMusicPlaying) {
      bgMusic.pause();
    } else if (!document.hidden && isMusicPlaying) {
      bgMusic.play().catch(() => {});
    }
  });

  // ================= 2. HIỆU ỨNG CHỮ HỶ BAY LÊN Ở MÀN HÌNH BÌA =================
  let hyInterval = null;

  function createFloatingHy() {
    if (!floatingContainer || document.hidden) return;

    const hyImg = document.createElement("img");
    hyImg.src = "images/chu-hy.webp";
    hyImg.classList.add("floating-hy");
    hyImg.style.left = Math.random() * 93 + 2 + "vw";

    const size = Math.random() * 12 + 14;
    hyImg.style.width = size + "px";

    const duration = Math.random() * 7 + 8;
    hyImg.style.animationDuration = duration + "s";

    floatingContainer.appendChild(hyImg);

    setTimeout(() => {
      hyImg.remove();
    }, duration * 1000);
  }

  if (floatingContainer) {
    for (let i = 0; i < 6; i++) {
      setTimeout(createFloatingHy, i * 600);
    }
    hyInterval = setInterval(createFloatingHy, 1200);
  }

  // ================= 3. PHÁO BÔNG CHỮ HỶ BUNG NỞ =================
  function launchHyFireworks(originX, originY, particleCount = 36) {
    const colors = ["#d62828", "#c3a370", "#e6b800", "#b5171e", "#f4d35e"];
    const fragment = document.createDocumentFragment();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("span");
      el.className = "hy-firework-particle";
      el.textContent = "囍";

      const size = Math.floor(Math.random() * 14) + 16;
      el.style.fontSize = `${size}px`;
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;

      fragment.appendChild(el);
      particles.push(el);
    }

    // Thêm toàn bộ 1 lần vào DOM thay vì thêm lẻ từng hạt giúp giảm lag khung hình đầu
    document.body.appendChild(fragment);

    particles.forEach((el, i) => {
      const angle =
        (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.35;
      const velocity = 90 + Math.random() * 170;
      const peakX = Math.cos(angle) * velocity;
      const peakY = Math.sin(angle) * velocity - (110 + Math.random() * 120);

      const endX = peakX * 1.25;
      const endY = peakY + (130 + Math.random() * 90);
      const rotatePeak = (Math.random() - 0.5) * 90;
      const rotateEnd = rotatePeak + (Math.random() - 0.5) * 120;
      const duration = 1400 + Math.random() * 600;

      const animation = el.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(0.2) rotate(0deg)",
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${peakX}px), calc(-50% + ${peakY}px)) scale(1.1) rotate(${rotatePeak}deg)`,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.65) rotate(${rotateEnd}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );

      animation.onfinish = () => el.remove();
    });
  }

  const heroHyIcon = document.querySelector(".hero-hy-center");
  if (heroHyIcon) {
    heroHyIcon.style.cursor = "pointer";
    heroHyIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = heroHyIcon.getBoundingClientRect();
      launchHyFireworks(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        32,
      );
    });
  }

  // ================= 4. TỰ ĐỘNG CUỘN MƯỢT TRANG CHÍNH (TỐI ƯU GPU) =================
  let isAutoScrolling = false;
  let autoScrollFrame = null;
  let lastTimestamp = null;
  let exactScrollY = 0;
  let cachedMaxScroll = 0;
  const AUTO_SCROLL_SPEED = 55; // Tốc độ cuộn (pixel/giây)

  function updateMaxScroll() {
    cachedMaxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
  }

  function stepAutoScroll(timestamp) {
    if (!isAutoScrolling) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05); // Chống nhảy cóc khi rớt frame
    lastTimestamp = timestamp;

    exactScrollY += AUTO_SCROLL_SPEED * deltaSeconds;
    window.scrollTo(0, Math.round(exactScrollY));

    if (exactScrollY >= cachedMaxScroll - 2) {
      stopAutoScroll();
      return;
    }

    autoScrollFrame = requestAnimationFrame(stepAutoScroll);
  }

  function startAutoScroll() {
    if (isAutoScrolling) return;
    updateMaxScroll();
    isAutoScrolling = true;
    lastTimestamp = null;
    exactScrollY = window.scrollY;
    autoScrollFrame = requestAnimationFrame(stepAutoScroll);
  }

  function stopAutoScroll() {
    if (!isAutoScrolling) return;
    isAutoScrolling = false;
    if (autoScrollFrame) {
      cancelAnimationFrame(autoScrollFrame);
      autoScrollFrame = null;
    }
  }

  // Dừng tự cuộn ngay lập tức khi người dùng chạm tay, cuộn chuột hoặc bấm phím
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((evt) => {
    window.addEventListener(evt, stopAutoScroll, { passive: true });
  });

  window.addEventListener("resize", updateMaxScroll, { passive: true });

  // ================= 5. SỰ KIỆN CLICK NÚT "MỞ THIỆP" =================
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (hyInterval) clearInterval(hyInterval);

      playOpenCardSoundEffect();

      setTimeout(() => {
        playWeddingMusic();
      }, 250);

      if (hyTransition) {
        hyTransition.classList.add("active");
      }
      if (introScreen) {
        introScreen.classList.add("fade-out");
      }

      setTimeout(() => {
        if (introScreen) {
          introScreen.remove(); // Xóa hẳn màn hình chờ khỏi DOM để giải phóng bộ nhớ
        }
        if (mainContent) mainContent.classList.remove("hidden");
        window.scrollTo(0, 0);
        updateMaxScroll();

        launchHyFireworks(window.innerWidth / 2, window.innerHeight / 2, 38);

        setTimeout(() => {
          startAutoScroll();
        }, 700);
      }, 450);

      setTimeout(() => {
        if (hyTransition) {
          hyTransition.remove(); // Xóa hẳn lớp phủ chuyển cảnh sau khi xong
        }
      }, 1150);
    });
  }

  // ================= 6. LẤY TÊN KHÁCH MỜI TỪ GOOGLE SHEET THEO ID =================
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjT87ps3alKYSVXOrhpLf26eEJU7pebuQSuTnoFSOJ_Eid0wlPjFDuGRi4LhEYhtGe2hESgkiWCs_8/pub?gid=0&single=true&output=csv";

  const urlParams = new URLSearchParams(window.location.search);
  const guestId = urlParams.get("id");

  function updateAllGuestNames(name) {
    const mainEl = document.getElementById("guest-name");
    if (mainEl) mainEl.textContent = name;

    document.querySelectorAll(".guest-name-sync").forEach((el) => {
      el.textContent = name;
    });
  }

  async function loadGuestNameById() {
    if (!guestId) {
      updateAllGuestNames("Quý Khách");
      return;
    }

    try {
      const response = await fetch(
        `${SHEET_CSV_URL}&t=${new Date().getTime()}`,
      );
      const csvText = await response.text();
      const rows = csvText.split(/\r?\n/);

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",");
        if (cols.length >= 2) {
          const rowId = cols[0].trim();
          const rowName = cols[1].replace(/^"|"$/g, "").trim();

          if (rowId === guestId.trim() && rowName !== "") {
            updateAllGuestNames(rowName);
            return;
          }
        }
      }

      updateAllGuestNames("Quý Khách");
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách mời:", error);
      updateAllGuestNames("Quý Khách");
    }
  }

  loadGuestNameById();

  // ================= XỬ LÝ NÚT XÁC NHẬN THAM DỰ (GỬI VỀ GOOGLE SHEET) =================
  const RSVP_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbxt4nbbIbfmvNoEX5TObCUbPY18KR09ngWkSqHVbLwTUWi5mxosBq0vzxr_fFWUkZhDNA/exec";
  const rsvpBtn = document.getElementById("open-rsvp-btn");

  if (rsvpBtn) {
    if (
      guestId &&
      localStorage.getItem(`rsvp_confirmed_${guestId}`) === "true"
    ) {
      rsvpBtn.textContent = "✓ ĐÃ XÁC NHẬN THAM DỰ";
      rsvpBtn.classList.add("is-confirmed");
    }

    rsvpBtn.addEventListener("click", async () => {
      if (!guestId) {
        alert(
          "Link thiệp chưa có mã khách mời (?id=...). Vui lòng mở đúng link thiệp được gửi riêng cho bạn!",
        );
        return;
      }

      if (rsvpBtn.disabled || rsvpBtn.classList.contains("is-confirmed"))
        return;

      const originalText = rsvpBtn.textContent;
      rsvpBtn.disabled = true;
      rsvpBtn.textContent = "ĐANG GỬI XÁC NHẬN...";

      try {
        const response = await fetch(RSVP_WEB_APP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({ id: guestId }),
        });

        const result = await response.json();

        if (result.status === "success") {
          rsvpBtn.textContent = "✓ ĐÃ XÁC NHẬN THAM DỰ";
          rsvpBtn.classList.add("is-confirmed");
          localStorage.setItem(`rsvp_confirmed_${guestId}`, "true");

          const rect = rsvpBtn.getBoundingClientRect();
          launchHyFireworks(rect.left + rect.width / 2, rect.top, 28);
        } else {
          throw new Error(result.message || "Lỗi xác nhận");
        }
      } catch (error) {
        console.error("Lỗi xác nhận tham dự:", error);
        rsvpBtn.disabled = false;
        rsvpBtn.textContent = originalText;
        alert(
          "Kết nối hơi chập chờn, bạn vui lòng bấm xác nhận lại giúp gia đình nhé!",
        );
      }
    });
  }

  // ================= 7. CẬP NHẬT LINK GOOGLE CALENDAR =================
  const calendarBtn = document.getElementById("googleCalendarBtn");
  if (calendarBtn) {
    const eventInfo = {
      title: "Tiệc Cưới Ngọc Chung & Kiều Diệp",
      startDate: "20270503T033000Z",
      endDate: "20270503T060000Z",
      location: "Trường Tiểu Học & THCS Hòa Tân, Thôn 5, Dang Kang, Đắk Lắk",
      details: "Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi!",
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventInfo.title,
      dates: `${eventInfo.startDate}/${eventInfo.endDate}`,
      location: eventInfo.location,
      details: eventInfo.details,
    });

    calendarBtn.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  // ================= 8. ALBUM ẢNH CƯỚI 3D COVERFLOW (CHỈ CHẠY KHI TRONG MÀN HÌNH) =================
  const slides = Array.from(
    document.querySelectorAll("#album-track .album-slide"),
  );
  const dotsContainer = document.getElementById("album-dots");
  const prevBtn = document.getElementById("album-prev");
  const nextBtn = document.getElementById("album-next");
  const carouselContainer = document.querySelector(".album-carousel-container");

  if (slides.length) {
    let currentIndex = Math.floor(slides.length / 2);
    let autoplayTimer = null;
    let isCarouselVisible = false;
    const AUTOPLAY_DELAY = 3000;

    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = "album-dot" + (idx === currentIndex ? " active" : "");
      dot.setAttribute("aria-label", `Xem ảnh ${idx + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetAutoplay();
      });
      dotsContainer?.appendChild(dot);
    });

    const dots = dotsContainer
      ? Array.from(dotsContainer.querySelectorAll(".album-dot"))
      : [];

    function renderCoverflow() {
      const isDesktop = window.innerWidth >= 768;
      const stepX = isDesktop ? 145 : 102;

      slides.forEach((slide, idx) => {
        const offset = idx - currentIndex;
        const absOffset = Math.abs(offset);

        if (offset === 0) {
          slide.style.transform =
            "translate3d(0px, 0px, 50px) scale(1) rotateY(0deg)";
          slide.style.zIndex = 20;
          slide.style.opacity = "1";
          slide.style.filter = "brightness(1)";
        } else if (absOffset <= 3) {
          const sign = offset > 0 ? 1 : -1;
          const translateX = sign * (stepX + (absOffset - 1) * (stepX * 0.62));
          const translateZ = -absOffset * 90;
          const scale = Math.max(0.65, 1 - absOffset * 0.11);
          const rotateY = -sign * 22;

          slide.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
          slide.style.zIndex = 10 - absOffset;
          slide.style.opacity = absOffset === 3 ? "0.65" : "0.92";
          slide.style.filter = "brightness(0.88)";
        } else {
          slide.style.transform = "translate3d(0px, 0px, -350px) scale(0.4)";
          slide.style.zIndex = 1;
          slide.style.opacity = "0";
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      renderCoverflow();
    }

    function startCarouselAutoplay() {
      if (!isCarouselVisible || document.hidden) return;
      stopCarouselAutoplay();
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function stopCarouselAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopCarouselAutoplay();
      startCarouselAutoplay();
    }

    prevBtn?.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });

    slides.forEach((slide, idx) => {
      slide.addEventListener("click", () => {
        if (idx !== currentIndex) {
          goToSlide(idx);
          resetAutoplay();
        }
      });
    });

    carouselContainer?.addEventListener("mouseenter", stopCarouselAutoplay);
    carouselContainer?.addEventListener("mouseleave", startCarouselAutoplay);

    let touchStartX = 0;
    const track = document.getElementById("album-track");
    track?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCarouselAutoplay();
      },
      { passive: true },
    );

    track?.addEventListener(
      "touchend",
      (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 35) {
          goToSlide(diff < 0 ? currentIndex + 1 : currentIndex - 1);
        }
        startCarouselAutoplay();
      },
      { passive: true },
    );

    // Chỉ chạy xoay ảnh 3D khi khách đang lướt tới khu vực Album, cuộn qua thì tạm dừng để nhẹ máy
    if (carouselContainer) {
      const albumObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isCarouselVisible = entry.isIntersecting;
            if (isCarouselVisible) {
              startCarouselAutoplay();
            } else {
              stopCarouselAutoplay();
            }
          });
        },
        { threshold: 0.1 },
      );
      albumObserver.observe(carouselContainer);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCarouselAutoplay();
      else startCarouselAutoplay();
    });

    window.addEventListener("resize", renderCoverflow, { passive: true });
    renderCoverflow();
  }

  // ================= 9. HIỆU ỨNG NỐI ĐIỂM LỊCH TRÌNH (CHẠY 1 LẦN MƯỢT MÀ) =================
  const timelineSection = document.getElementById("schedule-section");
  const timelineItems = Array.from(
    document.querySelectorAll("#wedding-timeline .timeline-item"),
  );

  if (timelineSection && timelineItems.length) {
    let hasPlayedTimeline = false;

    function playTimelineSequence() {
      if (hasPlayedTimeline) return;
      hasPlayedTimeline = true;
      const stepDelay = 380;

      timelineItems.forEach((item, index) => {
        const startTime = index * stepDelay;

        setTimeout(() => {
          item.classList.add("is-active", "is-pulse");
          setTimeout(() => item.classList.remove("is-pulse"), 350);
        }, startTime);

        setTimeout(() => {
          item.classList.add("is-drawing");
        }, startTime + 160);
      });
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playTimelineSequence();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(timelineSection);
  }

  // ================= 10. HIỆU ỨNG XUẤT HIỆN DẦN KHI CUỘN TRANG (CHỐNG GIẬT LAG) =================
  const closingSection = document.getElementById("closing-section");
  if (closingSection) {
    const closingObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            closingSection.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    closingObserver.observe(closingSection);
  }

  const revealSelectors = [
    ".section-banner-header",
    ".parents-grid",
    ".couple-full-names",
    ".ceremony-details > *",
    ".album-carousel-container",
    ".album-dots",
    ".reception-body > *",
    ".venue-address-text",
    ".map-frame-box",
    ".directions-link",
    ".schedule-title",
    ".closing-ornament",
    ".closing-greeting",
  ];

  const revealElements = Array.from(
    document.querySelectorAll(revealSelectors.join(", ")),
  );

  if (revealElements.length) {
    revealElements.forEach((el) => {
      el.classList.add("reveal-on-scroll");
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        let batchIndex = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.transitionDelay = `${batchIndex * 80}ms`;
            el.classList.add("is-revealed");
            batchIndex++;

            // Ngừng theo dõi phần tử đã hiện để không tính toán lại khi cuộn lên/xuống
            obs.unobserve(el);

            setTimeout(() => {
              el.style.transitionDelay = "0ms";
              el.style.willChange = "auto";
            }, 900);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }
});
