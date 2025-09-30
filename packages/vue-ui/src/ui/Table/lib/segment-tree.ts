export class SegmentTree {
  len: number;
  cap: number;
  tree: number[];

  constructor(data: number[]) {
    this.len = data.length;
    this.cap = 1;

    /** Find closest 2*n */
    while (this.cap < this.len) this.cap *= 2;

    /** Create array 2*(n+1) and fill by neutral elements. For min operation it is Infinity */
    this.tree = new Array(2 * this.cap).fill(Infinity);

    /** Add value from original array to tree start at 2*n index */
    for (let i = 0; i < this.len; i++) {
      this.tree[this.cap + i] = data[i];
    }

    /** Collect tree in interval from (2*n) - 1 to 1.  */
    for (let i = this.cap - 1; i > 0; i--) {
      this.tree[i] = Math.min(this.tree[2 * i], this.tree[2 * i + 1]);
    }
  }

  findLeast(l: number, r: number) {
    if (l > r) return Infinity;

    /** Get interval of original array in tree */
    l += this.cap;
    r += this.cap;

    /** Neutral value */
    let res = Infinity;

    while (l <= r) {
      /** If left is right sibling => get number and jump to right branch   */
      if (l % 2 === 1) {
        res = Math.min(res, this.tree[l++]);
      }
      /** if right is left sibling => get number and jump to left branch */
      if (r % 2 === 0) {
        res = Math.min(res, this.tree[r--]);
      }

      /** Jump to parent */
      l = Math.floor(l / 2);
      r = Math.floor(r / 2);
    }

    return res;
  }
}
