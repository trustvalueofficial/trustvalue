const ABOUT_TOASTS = "<div class=\"toasts\" aria-live=\"polite\"></div>";

export function AboutToasts() {
  return <div dangerouslySetInnerHTML={{ __html: ABOUT_TOASTS }} />;
}
