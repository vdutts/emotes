import { Favicon } from "./_components/favicon"

export { contentType, size } from "./_components/favicon"

export default async function Icon() {
  return Favicon({ url: "/_static/joker.png" })
}
