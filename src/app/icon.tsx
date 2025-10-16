import { Favicon } from "./_components/favicon"
import { PROD_URL } from "@/lib/constants"

export { contentType, size } from "./_components/favicon"

export default async function Icon() {
  return Favicon({ url: `${PROD_URL}/_static/joker.png` })
}
