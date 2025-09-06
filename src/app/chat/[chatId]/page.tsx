import HomeScreen from "@/components/HomeScreen";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return <HomeScreen chatId={chatId} />;
}
