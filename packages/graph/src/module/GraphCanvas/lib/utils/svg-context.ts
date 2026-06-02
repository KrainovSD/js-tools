type ContextState = {
  globalAlpha: number;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  font: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  textAlign: CanvasTextAlign;
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export class SvgContextAdapter {
  parts: string[];

  globalAlpha: number = 1;
  fillStyle: string = "black";
  strokeStyle: string = "black";
  lineWidth: number = 1;
  textAlign: CanvasTextAlign = "start";

  private _font: string = "normal normal 400 12px sans-serif";
  private fontFamily: string = "sans-serif";
  private fontSize: number = 12;
  private fontWeight: number = 400;
  private fontStyle: string = "normal";

  private stateStack: ContextState[] = [];
  private currentPath: string[] = [];
  private hasPath = false;
  private transformX = 0;
  private transformY = 0;
  private transformK = 1;

  constructor(parts: string[]) {
    this.parts = parts;
  }

  set font(value: string) {
    this._font = value;
    const p = value.trim().split(/\s+/);
    if (p.length >= 5) {
      this.fontStyle = p[0];
      this.fontWeight = parseInt(p[2], 10) || 400;
      this.fontSize = parseFloat(p[3]) || 12;
      this.fontFamily = p.slice(4).join(" ");
    }
  }

  get font(): string {
    return this._font;
  }

  save() {
    this.stateStack.push({
      globalAlpha: this.globalAlpha,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      font: this._font,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      textAlign: this.textAlign,
    });
  }

  restore() {
    const state = this.stateStack.pop();
    if (state) {
      this.globalAlpha = state.globalAlpha;
      this.fillStyle = state.fillStyle;
      this.strokeStyle = state.strokeStyle;
      this.lineWidth = state.lineWidth;
      this._font = state.font;
      this.fontFamily = state.fontFamily;
      this.fontSize = state.fontSize;
      this.fontWeight = state.fontWeight;
      this.fontStyle = state.fontStyle;
      this.textAlign = state.textAlign;
    }
  }

  beginPath() {
    this.currentPath = [];
    this.hasPath = false;
  }

  closePath() {
    this.currentPath.push("Z");
  }

  moveTo(x: number, y: number) {
    this.hasPath = true;
    this.currentPath.push(`M${x},${y}`);
  }

  lineTo(x: number, y: number) {
    this.hasPath = true;
    this.currentPath.push(`L${x},${y}`);
  }

  arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
    this.hasPath = true;
    if (endAngle - startAngle >= 2 * Math.PI - 0.01) {
      const x1 = cx - radius;
      const x2 = cx + radius;
      this.currentPath.push(
        `M${x1},${cy} A${radius},${radius} 0 1,1 ${x2},${cy} A${radius},${radius} 0 1,1 ${x1},${cy}`,
      );
    } else {
      const sx = cx + radius * Math.cos(startAngle);
      const sy = cy + radius * Math.sin(startAngle);
      const ex = cx + radius * Math.cos(endAngle);
      const ey = cy + radius * Math.sin(endAngle);
      this.currentPath.push(`M${sx},${sy} A${radius},${radius} 0 0,1 ${ex},${ey}`);
    }
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.hasPath = true;
    this.currentPath.push(`Q${cpx},${cpy} ${x},${y}`);
  }

  roundRect(x: number, y: number, w: number, h: number, radii: number | number[]) {
    this.hasPath = true;
    const r = typeof radii === "number" ? radii : (radii[0] ?? 0);
    if (r < 0.001) {
      this.currentPath.push(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`);
    } else {
      this.currentPath.push(
        `M${x + r},${y} L${x + w - r},${y} A${r},${r} 0 0,1 ${x + w},${y + r} L${x + w},${y + h - r} A${r},${r} 0 0,1 ${x + w - r},${y + h} L${x + r},${y + h} A${r},${r} 0 0,1 ${x},${y + h - r} L${x},${y + r} A${r},${r} 0 0,1 ${x + r},${y} Z`,
      );
    }
  }

  rect(x: number, y: number, w: number, h: number) {
    this.hasPath = true;
    this.currentPath.push(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`);
  }

  fill() {
    if (!this.hasPath) return;
    const d = this.currentPath.join(" ");
    this.parts.push(
      `<path d="${d}" fill="${this.fillStyle}" stroke="none" opacity="${this.globalAlpha}" stroke-linejoin="round"/>`,
    );
  }

  stroke() {
    if (!this.hasPath) return;
    const d = this.currentPath.join(" ");
    this.parts.push(
      `<path d="${d}" fill="none" stroke="${this.strokeStyle}" stroke-width="${this.lineWidth}" opacity="${this.globalAlpha}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  fillText(text: string, x: number, y: number) {
    const anchor =
      this.textAlign === "center" ? "middle" : this.textAlign === "right" ? "end" : "start";
    this.parts.push(
      `<text x="${x}" y="${y}" font-family="${this.fontFamily}" font-size="${this.fontSize}" font-weight="${this.fontWeight}" font-style="${this.fontStyle}" fill="${this.fillStyle}" text-anchor="${anchor}" opacity="${this.globalAlpha}">${escapeXml(text)}</text>`,
    );
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.parts.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.fillStyle}" opacity="${this.globalAlpha}"/>`,
    );
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    this.parts.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${this.strokeStyle}" stroke-width="${this.lineWidth}" opacity="${this.globalAlpha}"/>`,
    );
  }

  clearRect() {}

  translate(x: number, y: number) {
    this.transformX = x;
    this.transformY = y;
  }

  scale(k: number) {
    this.transformK = k;
  }

  closeTransform() {
    this.parts.unshift(
      `<g transform="translate(${this.transformX},${this.transformY}) scale(${this.transformK})">`,
    );
    this.parts.push("</g>");
  }

  setLineDash() {}

  clip() {}

  drawImage() {}
}
