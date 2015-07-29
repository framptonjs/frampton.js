// lines :: String -> Array String
export default function lines(str) {
  return str.split(/\r\n|\r|\n/g);
}