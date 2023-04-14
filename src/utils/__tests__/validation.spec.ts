import { validatePassword } from "../validation";

describe("validatePassword", () => {
  it.each([
    "abc", 
    "hdcsiuhpIfoifhdsoh823y4h2hdoqchocgHUHSDUGSLKSHDUIHEUGSHUDHSDHUSGDSUGDSUDGSDGSIDGIUSDGSIUDGSUDGSDGSDUGSDSUIDGSUGIDDy297y3d9",
    "abcd1234",
    "abcdABCD"
  ],
  )("Should fail validation", password => {
    const validation = validatePassword(password)
    expect(validation.valid).toBe(false)
  })

  it.each([
    "abcdABCD1234",
    "20sisduJSDHUI",
    "æøåABDI425"
  ],
  )("Should pass validation", password => {
    const validation = validatePassword(password)
    expect(validation.valid).toBe(true)
  })
})