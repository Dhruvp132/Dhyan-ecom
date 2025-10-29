"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const categories = [
	{
		label: "Men",
		imageUrl:
			"https://images.unsplash.com/photo-1550995694-3f5f4a7e1bd2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		altText: "man-image",
		blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
		link: "/category/man",
	},
	{
		label: "Women",
		imageUrl:
			"https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		altText: "woman-image",
		blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
		link: "/category/woman",
	},
	{
		label: "Children",
		imageUrl:
			"https://images.unsplash.com/photo-1541580621-cb65cc53084b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		altText: "children-image",
		blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
		link: "/category/children",
	},
];

const Category = () => {
	return (
		<section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
						Discover Our{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
							New Collection
						</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Elevate your style with our curated selection of clothing, shoes,
						and accessories. Find the perfect pieces to express your unique
						personality.
					</p>
				</motion.div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					{categories.map((category, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: index * 0.15,
								ease: [0.4, 0, 0.2, 1],
							}}
							whileHover={{
								scale: 1.03,
								transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
							}}
							whileTap={{ scale: 0.98 }}
						>
							<Link href={category.link} className="block">
								<motion.div
									className="relative group overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-out hover:shadow-2xl"
									whileHover="hover"
								>
									<Image
										width={600}
										height={400}
										className="object-cover w-full h-80"
										src={category.imageUrl}
										alt={category.altText}
										placeholder="blur"
										blurDataURL={category.blurDataURL}
									/>
									<div className="absolute inset-0 flex items-center justify-center p-6">
										<span className="text-white text-3xl font-bold tracking-wider text-center">
											{category.label}
										</span>
									</div>
									<motion.div
										className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
										initial={{ opacity: 0 }}
										whileHover={{ opacity: 1 }}
										transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
									>
										<motion.div className="absolute bottom-6 left-6 right-6">
											<motion.button
												whileHover={{
													scale: 1.05,
													backgroundColor: "#1a202c",
													color: "#ffffff",
													transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
												}}
												whileTap={{ scale: 0.97 }}
												className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-md transition-all duration-300 ease-out"
											>
												Explore {category.label}
											</motion.button>
										</motion.div>
									</motion.div>
								</motion.div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Category;
