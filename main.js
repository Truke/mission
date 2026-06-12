(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("mission-form-el");
  const startInput = document.getElementById("notify_start");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (startInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    startInput.min = now.toISOString().slice(0, 16);
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    const methods = form.querySelectorAll(
      'input[name^="notify_"]:checked'
    );
    const phone = form.phone?.value.trim();
    const email = form.email?.value.trim();
    const wechat = form.wechat?.value.trim();

    if (methods.length === 0) {
      event.preventDefault();
      showStatus("请至少选择一种通知方式。", "error");
      return;
    }

    const needsPhone = Array.from(methods).some((m) =>
      ["电话", "短信"].includes(m.value)
    );
    const needsEmail = Array.from(methods).some((m) => m.value === "邮件");
    const needsWechat = Array.from(methods).some((m) => m.value === "微信");

    if (needsPhone && !phone) {
      event.preventDefault();
      showStatus("您选择了电话或短信，请填写手机号。", "error");
      return;
    }

    if (needsEmail && !email) {
      event.preventDefault();
      showStatus("您选择了邮件通知，请填写邮箱。", "error");
      return;
    }

    if (needsWechat && !wechat) {
      event.preventDefault();
      showStatus("您选择了微信提醒，请填写微信号。", "error");
      return;
    }

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return;
    }

    event.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "提交中…";

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (response.ok) {
        window.location.href = "/thank-you";
      } else {
        showStatus("提交失败，请稍后重试或直接联系我们。", "error");
      }
    } catch {
      showStatus("网络异常，请检查连接后重试。", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showStatus(message, type) {
    let box = form.querySelector(".form-status");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-status";
      form.prepend(box);
    }
    box.className = `form-status ${type}`;
    box.textContent = message;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
})();
