"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type User = {
	id: string
	name: string
	email: string
	role: "admin" | "user" | "guest"
	avatar?: string
}

type UserCardProps = {
	userId: string
}

export function UserCard({ userId }: UserCardProps) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchUser() {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(`/api/users/${userId}`)

				if (!response.ok) {
					throw new Error(`Failed to fetch user: ${response.status}`)
				}

				const data = await response.json()
				setUser(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error")
			} finally {
				setLoading(false)
			}
		}

		void fetchUser()
	}, [userId])

	if (loading) {
		return (
			<Card className="w-80">
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
						<div className="space-y-2">
							<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							<div className="h-3 w-32 animate-pulse rounded bg-muted" />
						</div>
					</div>
				</CardHeader>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className="w-80 border-destructive">
				<CardHeader>
					<CardTitle className="text-destructive">Error</CardTitle>
					<CardDescription>{error}</CardDescription>
				</CardHeader>
			</Card>
		)
	}

	if (!user) {
		return null
	}

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()

	const roleColors = {
		admin: "bg-red-500/10 text-red-500 border-red-500/20",
		user: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		guest: "bg-gray-500/10 text-gray-500 border-gray-500/20",
	}

	return (
		<Card className="w-80">
			<CardHeader>
				<div className="flex items-center gap-4">
					<Avatar className="h-12 w-12">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<CardTitle className="text-base">{user.name}</CardTitle>
							<Badge variant="outline" className={roleColors[user.role]}>
								{user.role}
							</Badge>
						</div>
						<CardDescription>{user.email}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">User ID: {user.id}</p>
			</CardContent>
		</Card>
	)
}
