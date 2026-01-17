import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '../clipboard';

describe('copyToClipboard', () => {
  let originalClipboard: Clipboard | undefined;
  let originalExecCommand: typeof document.execCommand;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    originalExecCommand = document.execCommand;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
  });

  describe('Clipboard API 사용', () => {
    it('navigator.clipboard.writeText가 있으면 사용해야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('test text');

      expect(writeTextMock).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('Clipboard API 실패 시 execCommand 폴백을 사용해야 함', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });
      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyToClipboard('test text');

      expect(writeTextMock).toHaveBeenCalled();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });
  });

  describe('execCommand 폴백', () => {
    beforeEach(() => {
      // Remove Clipboard API to test fallback
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });
    });

    it('Clipboard API가 없으면 execCommand를 사용해야 함', async () => {
      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyToClipboard('fallback text');

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('execCommand 실패 시 false를 반환해야 함', async () => {
      document.execCommand = vi.fn().mockReturnValue(false);

      const result = await copyToClipboard('test');

      expect(result).toBe(false);
    });

    it('execCommand 예외 발생 시 false를 반환해야 함', async () => {
      document.execCommand = vi.fn().mockImplementation(() => {
        throw new Error('execCommand not supported');
      });

      const result = await copyToClipboard('test');

      expect(result).toBe(false);
    });

    it('textarea를 생성하고 제거해야 함', async () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');
      document.execCommand = vi.fn().mockReturnValue(true);

      await copyToClipboard('test');

      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      const appendedElement = appendChildSpy.mock.calls[0][0] as HTMLTextAreaElement;
      expect(appendedElement.tagName).toBe('TEXTAREA');
      expect(appendedElement.value).toBe('test');
    });
  });

  describe('silent 모드', () => {
    it('silent=true일 때 Clipboard API를 건너뛰고 execCommand를 사용해야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });
      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyToClipboard('silent copy', true);

      expect(writeTextMock).not.toHaveBeenCalled();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('silent=false일 때 Clipboard API를 먼저 시도해야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('normal copy', false);

      expect(writeTextMock).toHaveBeenCalledWith('normal copy');
      expect(result).toBe(true);
    });
  });

  describe('빈 문자열 처리', () => {
    it('빈 문자열도 복사할 수 있어야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('');

      expect(writeTextMock).toHaveBeenCalledWith('');
      expect(result).toBe(true);
    });
  });

  describe('특수 문자 처리', () => {
    it('UUID 형식 문자열을 복사할 수 있어야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = await copyToClipboard(uuid);

      expect(writeTextMock).toHaveBeenCalledWith(uuid);
      expect(result).toBe(true);
    });

    it('여러 줄 텍스트를 복사할 수 있어야 함', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const multiline = 'line1\nline2\nline3';
      const result = await copyToClipboard(multiline);

      expect(writeTextMock).toHaveBeenCalledWith(multiline);
      expect(result).toBe(true);
    });
  });
});
