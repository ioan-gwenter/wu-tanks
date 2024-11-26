"use client"
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-800">
            <h1 className="text-5xl font-bold text-gray-700 dark:text-gray-200 mb-12">
                404 :(
            </h1>
            <h2 className="text-5xl font-bold text-gray-700 dark:text-gray-200 mb-12">
                Looks like you got lost!
            </h2>
            <Link href="/">
                <p className="px-6 py-3 bg-indigo-600 text-white text-2xl rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
                    Return To Game
                </p>
            </Link>
        </div>
    );
}