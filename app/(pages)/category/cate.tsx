"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const categoryData = [
	{
		href: "/category/man",
		image:
			"https://images.unsplash.com/photo-1517940310602-26535839fe84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tag: "#Men",
		title: "Elevate Your Style with Trending Men's Fashion",
		gradient: "from-purple-500 via-pink-500 to-red-500",
		description:
			"Discover a curated collection of men's apparel, from casual wear to formal attire.",
	},
	{
		href: "/category/woman",
		image:
			"https://images.unsplash.com/flagged/photo-1553802922-2eb2f7f2c65b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tag: "#Women",
		title: "Explore Our Diverse Women's Fashion Collection",
		gradient: "from-green-400 via-blue-500 to-purple-600",
		description:
			"Find the perfect outfit for any occasion with our extensive range of women's clothing.",
	},
	{
		href: "/category/children",
		image:
			"https://images.unsplash.com/photo-1519308914928-2e6b45de9ac1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		tag: "#Children",
		title: "Discover Playful and Stylish Children's Fashion",
		gradient: "from-yellow-400 via-orange-500 to-red-600",
		description:
			"Dress your little ones in comfort and style with our adorable children's wear.",
	},
];
const Categories = () => {
	return (
		<div className="container mx-auto px-4 py-12">
			<motion.h1
				className="text-4xl md:text-5xl font-bold text-center mb-12"
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
			>
				Explore Our Fashion Categories
			</motion.h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{categoryData.map((category, index) => (
					<motion.div
						key={category.href}
						className={`relative ${index === 2 ? "md:col-span-2" : ""}`}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: index * 0.15,
							ease: [0.4, 0, 0.2, 1],
						}}
						whileHover={{
							y: -8,
							transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
						}}
					>
						<Link href={category.href} className="block">
							<div
								className={`relative bg-gradient-to-r ${category.gradient} rounded-2xl overflow-hidden shadow-2xl group`}
							>
								<Image
									width={2070}
									height={1000}
									src={category.image}
									alt={category.tag.slice(1)}
									className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity duration-300"
								/>
								<div className="relative z-10 p-8 md:p-12">
									<span className="inline-block px-3 py-1 text-sm font-semibold bg-white text-gray-800 rounded-full mb-4">
										{category.tag}
									</span>
									<h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
										{category.title}
									</h2>
									<p className="text-white text-opacity-90 mb-6">
										{category.description}
									</p>
									<span className="inline-flex items-center text-white group-hover:text-yellow-300 transition-all duration-300 ease-out">
										Explore Now{" "}
										<FaArrowRight className="ml-2 transition-transform duration-300 ease-out group-hover:translate-x-2" />
									</span>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default Categories;
