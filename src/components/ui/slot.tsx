import * as React from "react"

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) {
  const merged: Record<string, unknown> = { ...childProps }

  for (const key of Object.keys(slotProps)) {
    const slotVal = slotProps[key]
    const childVal = childProps[key]

    if (key === "style") {
      merged[key] = { ...(slotVal as object), ...(childVal as object) }
    } else if (key === "className") {
      merged[key] = [slotVal, childVal].filter(Boolean).join(" ")
    } else if (typeof slotVal === "function" && typeof childVal === "function") {
      merged[key] = (...args: unknown[]) => {
        childVal(...args)
        slotVal(...args)
      }
    } else if (key in slotProps) {
      merged[key] = slotVal
    }
  }

  return merged
}

const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, ...slotProps }, forwardedRef) => {
  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown> & { ref?: React.Ref<HTMLElement> }
  >

  return React.cloneElement(child, {
    ...mergeProps(slotProps, child.props),
    ref: forwardedRef,
  } as Record<string, unknown>)
})

Slot.displayName = "Slot"

export { Slot }
