export const calculateColor = (index: number) => {
  const color = index % 5
  if (color === 0) {
    // nice pink
    return '#ef60a2'
  } else if (color === 1) {
    // nice orange
    return '#fba020'
  } else if (color === 2) {
    // nice yellow
    return '#e0e000'
  } else if (color === 3) {
    // nice blue
    return '#5cb85c'
  } else if (color === 4) {
    // nice purple
    return '#5bc0de'
  }
}
