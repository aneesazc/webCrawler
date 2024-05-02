import { test, expect } from "@jest/globals";

import { normalizeURL } from "./crawl.js";

test("normalizeURL strip", () => {
    const input = "http://example.com/";
    const actual = normalizeURL(input);
    const expected = "example.com";
    expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
    const input = "http://EXAMPLE.com";
    const actual = normalizeURL(input);
    const expected = "example.com";
    expect(actual).toEqual(expected);
});
