import { getTranslations } from "next-intl/server";
import PerspectivesClient from "./PerspectivesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Perspectives" });
  return {
    title: `${t("title")} | GlobalNow`,
    description: t("description"),
  };
}

export default function PerspectivesPage() {
  return <PerspectivesClient />;
}
