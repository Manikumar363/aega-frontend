"use client";

import {
	BadgeCheck,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Employee = {
	id: number;
	name: string;
	designation: string;
	mobile: string;
	email: string;
	verified: "green" | "yellow";
	status: "green" | "red" | "gray";
};

const employees: Employee[] = [
	{ id: 1, name: "Liam", designation: "Managing Director", mobile: "5506556340", email: "liam@gmail.com", verified: "green", status: "green" },
	{ id: 2, name: "Mason", designation: "Chief Operating Officer", mobile: "9876543210", email: "mason@gmail.com", verified: "yellow", status: "green" },
	{ id: 3, name: "Liam", designation: "Chief Marketing Officer", mobile: "6543217890", email: "liam@gmail.com", verified: "green", status: "red" },
	{ id: 4, name: "Liam", designation: "Chief Financial Officer", mobile: "7890123456", email: "liam@gmail.com", verified: "green", status: "gray" },
	{ id: 5, name: "Mason", designation: "Education Counselor", mobile: "1234567890", email: "mason@gmail.com", verified: "yellow", status: "green" },
	{ id: 6, name: "Mason", designation: "Student Counselor", mobile: "4567890123", email: "mason@gmail.com", verified: "yellow", status: "green" },
	{ id: 7, name: "Liam", designation: "Career Counselor", mobile: "9876504321", email: "liam@gmail.com", verified: "green", status: "green" },
	{ id: 8, name: "James", designation: "Academic Advisor", mobile: "2345678901", email: "james@gmail.com", verified: "green", status: "green" },
	{ id: 9, name: "Sarah", designation: "Admissions Counselor", mobile: "3456789012", email: "sarah@email.com", verified: "green", status: "green" },
	{ id: 10, name: "Michael", designation: "Visa Counselor", mobile: "4567890123", email: "michael@domain.com", verified: "green", status: "green" },
];

const PAGE_SIZE = 8;

const statusDotClass: Record<Employee["status"], string> = {
	green: "bg-green-500",
	red: "bg-red-500",
	gray: "bg-gray-400",
};

const EmployeeTable: React.FC = () => {
	const [page, setPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
	const paginated = useMemo(
		() => employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		[page]
	);

	const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

	const pageNumbers: (number | "...")[] = [];
	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
	} else {
		pageNumbers.push(1, 2, 3, "...", totalPages);
	}

	return (
		<div className="space-y-3">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[1100px] border-collapse text-sm">
					<thead>
						<tr className="bg-[#14123A] text-white">
							{["Image", "Name", "Designation", "Mobile Number", "Email", "Action"].map((h) => (
								<th key={h} className="px-5 py-4 text-center font-semibold border border-[#49506C]">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginated.map((emp) => (
							<tr key={emp.id} className="bg-[#14123A] text-white">
								<td className="px-5 py-4 border border-[#49506C]">
									<div className="flex items-center justify-center">
										<div className="relative w-9 h-9 rounded-full bg-[#efe98f] flex items-center justify-center text-[#1b1b1b] text-[10px] font-bold">
											{emp.name.slice(0, 2).toUpperCase()}
											<span className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-[#14123A] ${statusDotClass[emp.status]}`} />
										</div>
									</div>
								</td>
								<td className="px-5 py-4 text-center border border-[#49506C]">
									<div className="inline-flex items-center gap-1.5">
										<span>{emp.name}</span>
										<BadgeCheck className={`w-4 h-4 ${emp.verified === "green" ? "text-[#00e0b8]" : "text-[#facc15]"}`} />
									</div>
								</td>
								<td className="px-5 py-4 text-center border border-[#49506C]">{emp.designation}</td>
								<td className="px-5 py-4 text-center border border-[#49506C]">{emp.mobile}</td>
								<td className="px-5 py-4 text-center border border-[#49506C]">{emp.email}</td>
								<td className="px-5 py-4 text-center border border-[#49506C]">
									<div className="flex items-center justify-center gap-2">
										<button type="button" className="w-7 h-7 rounded-lg bg-[#F7941D] hover:bg-[#e28518] flex items-center justify-center transition-colors" aria-label="View">
											<Eye className="w-3.5 h-3.5 text-white" />
										</button>
										<button type="button" className="w-7 h-7 rounded-lg bg-[#3F5AE6] hover:bg-[#334bd0] flex items-center justify-center transition-colors" aria-label="Edit">
											<Pencil className="w-3.5 h-3.5 text-white" />
										</button>
										<button type="button" className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors" aria-label="Delete">
											<Trash2 className="w-3.5 h-3.5 text-white" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between mt-3 text-sm text-white">
				<div className="flex items-center gap-1">
					<button
						onClick={() => goTo(page - 1)}
						disabled={page === 1}
						className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					{pageNumbers.map((p, i) =>
						p === "..." ? (
							<span key={i} className="px-2 text-gray-400">...</span>
						) : (
							<button
								key={i}
								onClick={() => goTo(p as number)}
								className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
									page === p
										? "bg-[#F68E2D] text-white"
										: "border border-[#2D2A50] hover:bg-[#14123A] text-white"
								}`}
							>
								{p}
							</button>
						)
					)}
					<button
						onClick={() => goTo(page + 1)}
						disabled={page === totalPages}
						className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
				<div className="flex items-center gap-2 text-gray-400 text-xs">
					<span>
						Showing {Math.min((page - 1) * PAGE_SIZE + 1, employees.length)} to {Math.min(page * PAGE_SIZE, employees.length)} of {employees.length} entries
					</span>
					<button className="flex items-center gap-1 border border-[#2D2A50] px-3 py-1 rounded hover:bg-[#14123A] transition-colors">
						Show {PAGE_SIZE} <ChevronDown className="w-3 h-3" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default EmployeeTable;
