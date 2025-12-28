/**
 * Graphics Singleton
 * Manages graphics operations including canvas rendering, image processing, and chart utilities
 */
class Graphics {
  private static instance: Graphics;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
    if (typeof window !== 'undefined') {
      this.initCanvas();
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): Graphics {
    if (!Graphics.instance) {
      Graphics.instance = new Graphics();
    }
    return Graphics.instance;
  }

  /**
   * Initialize canvas element
   */
  private initCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Get canvas context
   */
  public getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  /**
   * Resize canvas
   */
  public resizeCanvas(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /**
   * Clear canvas
   */
  public clearCanvas(): void {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Load image from URL
   */
  public async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Draw image on canvas
   */
  public drawImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void {
    if (this.ctx) {
      if (width && height) {
        this.ctx.drawImage(image, x, y, width, height);
      } else {
        this.ctx.drawImage(image, x, y);
      }
    }
  }

  /**
   * Convert canvas to blob
   */
  public async toBlob(type = 'image/png', quality = 0.92): Promise<Blob | null> {
    if (!this.canvas) return null;

    return new Promise((resolve) => {
      this.canvas?.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  /**
   * Convert canvas to data URL
   */
  public toDataURL(type = 'image/png', quality = 0.92): string {
    if (!this.canvas) return '';
    return this.canvas.toDataURL(type, quality);
  }

  /**
   * Draw text on canvas
   */
  public drawText(
    text: string,
    x: number,
    y: number,
    options?: {
      font?: string;
      fillStyle?: string;
      textAlign?: CanvasTextAlign;
      textBaseline?: CanvasTextBaseline;
    }
  ): void {
    if (!this.ctx) return;

    if (options?.font) this.ctx.font = options.font;
    if (options?.fillStyle) this.ctx.fillStyle = options.fillStyle;
    if (options?.textAlign) this.ctx.textAlign = options.textAlign;
    if (options?.textBaseline) this.ctx.textBaseline = options.textBaseline;

    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw rectangle
   */
  public drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: {
      fillStyle?: string;
      strokeStyle?: string;
      lineWidth?: number;
    }
  ): void {
    if (!this.ctx) return;

    if (options?.fillStyle) {
      this.ctx.fillStyle = options.fillStyle;
      this.ctx.fillRect(x, y, width, height);
    }

    if (options?.strokeStyle) {
      this.ctx.strokeStyle = options.strokeStyle;
      if (options?.lineWidth) this.ctx.lineWidth = options.lineWidth;
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Draw circle
   */
  public drawCircle(
    x: number,
    y: number,
    radius: number,
    options?: {
      fillStyle?: string;
      strokeStyle?: string;
      lineWidth?: number;
    }
  ): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (options?.fillStyle) {
      this.ctx.fillStyle = options.fillStyle;
      this.ctx.fill();
    }

    if (options?.strokeStyle) {
      this.ctx.strokeStyle = options.strokeStyle;
      if (options?.lineWidth) this.ctx.lineWidth = options.lineWidth;
      this.ctx.stroke();
    }
  }

  /**
   * Draw line
   */
  public drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: {
      strokeStyle?: string;
      lineWidth?: number;
      lineCap?: CanvasLineCap;
    }
  ): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    if (options?.strokeStyle) this.ctx.strokeStyle = options.strokeStyle;
    if (options?.lineWidth) this.ctx.lineWidth = options.lineWidth;
    if (options?.lineCap) this.ctx.lineCap = options.lineCap;

    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  /**
   * Apply image filter
   */
  public applyFilter(filter: string): void {
    if (this.ctx) {
      this.ctx.filter = filter;
    }
  }

  /**
   * Reset filters
   */
  public resetFilters(): void {
    if (this.ctx) {
      this.ctx.filter = 'none';
    }
  }

  /**
   * Get image data
   */
  public getImageData(x: number, y: number, width: number, height: number): ImageData | null {
    if (!this.ctx) return null;
    return this.ctx.getImageData(x, y, width, height);
  }

  /**
   * Put image data
   */
  public putImageData(imageData: ImageData, x: number, y: number): void {
    if (this.ctx) {
      this.ctx.putImageData(imageData, x, y);
    }
  }
}

// Export singleton instance
export const graphics = Graphics.getInstance();
