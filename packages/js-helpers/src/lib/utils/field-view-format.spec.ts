import { FIELD_TYPES } from "../../constants";
import type { FieldType } from "../../types";
import { fieldViewFormat } from "./field-view-format";

describe("field-view-format", () => {
  describe("array field", () => {
    it("array success", () => {
      const args = ["test", "suit", "check"];

      expect(fieldViewFormat(args, FIELD_TYPES.Array)).toBe("test, suit, check");
    });
    it("array bad", () => {
      expect(fieldViewFormat({}, FIELD_TYPES.Array)).toBe("");
    });
  });
  describe("date field", () => {
    it("date success", () => {
      const year = 2020;
      const month = 11;
      const day = 10;
      const date = new Date();
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);

      expect(fieldViewFormat(date, FIELD_TYPES.Date)).toBe(`${day}.${month + 1}.${year}`);
      expect(fieldViewFormat(date.getTime(), FIELD_TYPES.Date)).toBe(`${day}.${month + 1}.${year}`);
      expect(fieldViewFormat(date.toISOString(), FIELD_TYPES.Date)).toBe(
        `${day}.${month + 1}.${year}`,
      );
      expect(fieldViewFormat(date.toUTCString(), FIELD_TYPES.Date)).toBe(
        `${day}.${month + 1}.${year}`,
      );
    });
    it("date bad", () => {
      expect(fieldViewFormat({}, FIELD_TYPES.Date)).toBe(``);
    });
  });
  describe("date time field", () => {
    it("date time success", () => {
      const year = 2020;
      const month = 11;
      const day = 10;
      const date = new Date();
      const hours = 11;
      const minutes = 34;
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
      date.setHours(hours);
      date.setMinutes(minutes);

      expect(fieldViewFormat(date, FIELD_TYPES.DateTime)).toBe(
        `${day}.${month + 1}.${year} ${hours}:${minutes}`,
      );
      expect(fieldViewFormat(date.getTime(), FIELD_TYPES.DateTime)).toBe(
        `${day}.${month + 1}.${year} ${hours}:${minutes}`,
      );
      expect(fieldViewFormat(date.toISOString(), FIELD_TYPES.DateTime)).toBe(
        `${day}.${month + 1}.${year} ${hours}:${minutes}`,
      );
      expect(fieldViewFormat(date.toUTCString(), FIELD_TYPES.DateTime)).toBe(
        `${day}.${month + 1}.${year} ${hours}:${minutes}`,
      );
    });
    it("date time bad", () => {
      expect(fieldViewFormat({}, FIELD_TYPES.DateTime)).toBe(``);
    });
  });
  describe("time field", () => {
    it("time success", () => {
      const date = new Date();
      const hours = 11;
      const minutes = 34;
      date.setHours(hours);
      date.setMinutes(minutes);

      expect(fieldViewFormat(date, FIELD_TYPES.Time)).toBe(`${hours}:${minutes}`);
      expect(fieldViewFormat(date.getTime(), FIELD_TYPES.Time)).toBe(`${hours}:${minutes}`);
      expect(fieldViewFormat(date.toISOString(), FIELD_TYPES.Time)).toBe(`${hours}:${minutes}`);
      expect(fieldViewFormat(date.toUTCString(), FIELD_TYPES.Time)).toBe(`${hours}:${minutes}`);
    });
    it("time bad", () => {
      expect(fieldViewFormat({}, FIELD_TYPES.Time)).toBe(``);
    });
  });
  describe("number field", () => {
    it("number success", () => {
      expect(fieldViewFormat("12px", FIELD_TYPES.Number)).toBe("12");
      expect(fieldViewFormat(true, FIELD_TYPES.Number)).toBe("1");
      expect(fieldViewFormat(13, FIELD_TYPES.Number)).toBe("13");
    });
    it("number bad", () => {
      expect(fieldViewFormat([], FIELD_TYPES.Number)).toBe("");
    });
  });
  describe("string field", () => {
    it("string success", () => {
      expect(fieldViewFormat("12px", FIELD_TYPES.String)).toBe("12px");
      expect(fieldViewFormat(true, FIELD_TYPES.String)).toBe("true");
      expect(fieldViewFormat(13, FIELD_TYPES.String)).toBe("13");
    });
    it("string bad", () => {
      expect(fieldViewFormat([], FIELD_TYPES.String)).toBe("");
    });
  });
  describe("default field", () => {
    it("default success", () => {
      expect(fieldViewFormat("12px", "default" as FieldType)).toBe("12px");
      expect(fieldViewFormat(true, "default" as FieldType)).toBe("true");
      expect(fieldViewFormat(13, "default" as FieldType)).toBe("13");
    });
    it("default bad", () => {
      expect(fieldViewFormat([], "default" as FieldType)).toBe("");
    });
  });
  describe("no field field", () => {
    it("no field success", () => {
      expect(fieldViewFormat("12px")).toBe("12px");
      expect(fieldViewFormat(true)).toBe("true");
      expect(fieldViewFormat(13)).toBe("13");
    });
    it("no field bad", () => {
      expect(fieldViewFormat([])).toBe("");
    });
  });
});
