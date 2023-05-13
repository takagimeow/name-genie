import React from "react";
import { renderHook, act } from "@testing-library/react-hooks"
import { expect } from "vitest";

const useCount = () => {
  const [count, setCount] = React.useState(0)
  return {
    count,
    setCount
  }
}
it("smoke test", () => {
  const { result } = renderHook(() => useCount())
  act(() => {
    result.current.setCount(1)
  })
  expect(result.current.count).toBe(1)
})
