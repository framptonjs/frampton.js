// words :: String -> Array String
export default function words(str) {
  return str.trim().split(/\s+/g);
}