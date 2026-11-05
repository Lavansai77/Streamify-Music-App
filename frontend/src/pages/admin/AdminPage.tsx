import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, ArrowLeft, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	const navigate = useNavigate();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div
			className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 
			to-black text-zinc-100 p-8"
		>
			{/* Back to Home */}
			<button
				onClick={() => navigate("/")}
				className="mb-6 flex items-center gap-2 text-sm text-zinc-400 
				hover:text-white transition-colors"
			>
				<ArrowLeft className="size-4" />
				Back to Home
			</button>

			<Header />

			<DashboardStats />

			<Tabs defaultValue="songs" className="space-y-6">
				<TabsList className="p-1 bg-zinc-800/50">
					<TabsTrigger
						value="songs"
						className="data-[state=active]:bg-zinc-700"
					>
						<Music className="mr-2 size-4" />
						Songs
					</TabsTrigger>

					<TabsTrigger
						value="albums"
						className="data-[state=active]:bg-zinc-700"
					>
						<Album className="mr-2 size-4" />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value="songs">
					<SongsTabContent />
				</TabsContent>

				<TabsContent value="albums">
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminPage;