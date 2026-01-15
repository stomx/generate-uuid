/**
 * execCommand로 클립보드 복사 (권한 요청 없음)
 */
function execCommandCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * 클립보드에 텍스트 복사
 *
 * @param text - 복사할 텍스트
 * @param silent - true면 권한 팝업 없이 복사 (자동 복사용)
 */
export async function copyToClipboard(text: string, silent = false): Promise<boolean> {
  // silent 모드: execCommand만 사용 (권한 팝업 없음)
  if (silent) {
    return execCommandCopy(text);
  }

  // 일반 모드: Clipboard API 우선, 실패 시 execCommand 폴백
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 폴백으로 진행
    }
  }

  return execCommandCopy(text);
}
