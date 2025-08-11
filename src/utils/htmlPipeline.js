// src/utils/htmlPipeline.js

/** 1) 화면/복사용 공통: 줄바꿈 규칙 적용 */
export function addVisualSpacing(html) {
  if (!html) return html || "";
  let out = html;
  out = out.replace(/<\/h1>\s*<h3>/gi, "</h1><br><br><br><h3>"); // </h1>~<h3>: 3줄
  out = out.replace(/<\/p>\s*<h3>/gi, "</p><br><br><br><br><h3>"); // </p>~<h3>: 4줄
  out = out.replace(/<\/p>\s*<p>/gi, "</p><br><p>"); // </p>~<p>: 1줄
  return out;
}

/** 2) 프록시 URL → 원본( ?url= 값 디코딩 ) */
export function decodeProxyInHtml(html) {
  if (!html) return html || "";
  const deEnt = html.replace(/&amp;/g, "&"); // HTML 엔티티 방어
  return deEnt.replace(
    /(<img[^>]+src=")([^"]*proxy-image[^"]+?url=)([^"&]+)([^"]*)"/gi,
    function (m, before, _prefix, encoded, after) {
      try {
        let dec = encoded;
        try { dec = decodeURIComponent(dec); } catch (e1) {}
        try { dec = decodeURIComponent(dec); } catch (e2) {}
        return before + dec + after + "\"";
      } catch {
        return m;
      }
    }
  );
}

/** 3) 필요 시: DB의 image_1~3_url을 순서 매핑 (있을 때만) */
export function replaceWithDbImages(html, detail) {
  if (!html) return html || "";
  const urls = [
    detail && detail.image_1_url,
    detail && detail.image_2_url,
    detail && detail.image_3_url,
  ].filter(function (u) { return typeof u === "string" && u.trim() !== ""; });

  if (!urls.length) return html;

  let idx = 0;
  return html.replace(
    /(<img[^>]+src=")([^"]*proxy-image[^"]+)("[^>]*>)/gi,
    function (m, before, _proxy, after) {
      if (urls[idx]) {
        var next = before + urls[idx] + after;
        idx += 1;
        return next;
      }
      return m;
    }
  );
}

/** 복사용 최종 HTML 만들기: 줄바꿈 → 프록시 디코드 → (옵션) DB 이미지 매핑 */
export function buildCopyHtml(detail, useDbImages) {
  var raw = (detail && detail.content) || "";
  var spaced = addVisualSpacing(raw);
  var decoded = decodeProxyInHtml(spaced);
  return useDbImages ? replaceWithDbImages(decoded, detail) : decoded;
}

/** 리치 HTML 복사 (text/html 우선, 폴백 포함) */
export async function copyHtmlRich(html) {
  var plain = stripHtml(html);

  if (navigator.clipboard && window.ClipboardItem) {
    try {
      var item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
      return true;
    } catch (e) { /* fallback */ }
  }

  try {
    var ghost = document.createElement("div");
    ghost.style.position = "fixed";
    ghost.style.left = "-99999px";
    ghost.style.top = "0";
    ghost.innerHTML = html;
    document.body.appendChild(ghost);

    var range = document.createRange();
    range.selectNodeContents(ghost);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    var ok = document.execCommand("copy");
    sel.removeAllRanges();
    document.body.removeChild(ghost);
    if (ok) return true;
  } catch (e2) { /* fallback */ }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(plain);
      return true;
    }
  } catch (e3) {}

  return false;
}

function stripHtml(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim();
}
