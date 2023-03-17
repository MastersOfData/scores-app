import { validatePassword } from "../acccount";

test("validatePassword", () => {
  expect(validatePassword("abc").valid).toBe(false)
  expect(validatePassword("hdcsiuhpIfoifhdsoh823y4h2hdoqchocgHUHSDUGSLKSHDUIHEUGSHUDHSDHUSGDSUGDSUDGSDGSIDGIUSDGSIUDGSUDGSDGSDUGSDSUIDGSUGIDDy297y3d9").valid).toBe(false)
  expect(validatePassword("abcd1234").valid).toBe(false)
  expect(validatePassword("ABCD1234").valid).toBe(false)
  expect(validatePassword("abcdABCD").valid).toBe(false)
  expect(validatePassword("abCD1234").valid).toBe(true)
  expect(validatePassword("æøåABDI425").valid).toBe(true)
})