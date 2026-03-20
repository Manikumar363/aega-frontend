"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";

type TxStatus = "Pending" | "Success" | "Failed" | "Passed" | "In Progress";

type Transaction = {
  id: number;
  studentName: string;
  agentName: string;
  universityName: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: TxStatus;
};

type TransactionDetails = {
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: string;
  agentFirstName: string;
  agentLastName: string;
  agentEmail: string;
  agentPhone: string;
  universityName: string;
  universityLocation: string;
  universityEmail: string;
  universityPhone: string;
  courseName: string;
  intake: string;
  startingDate: string;
  endingDate: string;
  tuitionFee: string;
  firstTermFee: string;
};

const transactions: Transaction[] = [
  { id: 1, studentName: "Liam", agentName: "Liam", universityName: "Loughborough University", startDate: "01/09/2026", endDate: "01/09/2027", amount: "$500", status: "Pending" },
  { id: 2, studentName: "Mason", agentName: "Mason", universityName: "Kingston University", startDate: "13/09/2026", endDate: "13/09/2027", amount: "$500", status: "Success" },
  { id: 3, studentName: "Liam", agentName: "Liam", universityName: "City College London", startDate: "15/09/2026", endDate: "15/09/2027", amount: "$500", status: "Success" },
  { id: 4, studentName: "Liam", agentName: "Liam", universityName: "KAIST", startDate: "12/09/2026", endDate: "12/09/2027", amount: "$500", status: "Success" },
  { id: 5, studentName: "Mason", agentName: "Mason", universityName: "RMIT University", startDate: "06/09/2026", endDate: "06/09/2027", amount: "$500", status: "Failed" },
  { id: 6, studentName: "Sophia", agentName: "Johnson", universityName: "University of Melbourne", startDate: "07/11/2025", endDate: "07/11/2026", amount: "$750", status: "Passed" },
  { id: 7, studentName: "Liam", agentName: "Brown", universityName: "Monash University", startDate: "12/05/2023", endDate: "12/05/2024", amount: "$300", status: "In Progress" },
  { id: 8, studentName: "Olivia", agentName: "Davis", universityName: "University of Sydney", startDate: "15/08/2024", endDate: "15/08/2025", amount: "$600", status: "Passed" },
  { id: 9, studentName: "Noah", agentName: "Wilson", universityName: "Queensland University of Technology", startDate: "20/02/2025", endDate: "20/02/2026", amount: "$400", status: "Failed" },
  { id: 10, studentName: "Noah", agentName: "Wilson", universityName: "Queensland University of Technology", startDate: "20/02/2025", endDate: "20/02/2026", amount: "$400", status: "Failed" },
];

const detailsByTransactionId: Record<number, TransactionDetails> = {
  1: {
    studentFirstName: "Liam",
    studentLastName: "Decker",
    studentEmail: "liam@gmail.com",
    studentPhone: "+44 2598635900",
    agentFirstName: "Liam",
    agentLastName: "Decker",
    agentEmail: "liam@gmail.com",
    agentPhone: "+44 2598635900",
    universityName: "Loughborough University",
    universityLocation: "Loughborough",
    universityEmail: "liam@gmail.com",
    universityPhone: "+44 2598635900",
    courseName: "Course Name",
    intake: "Date",
    startingDate: "Date",
    endingDate: "Date",
    tuitionFee: "Fee",
    firstTermFee: "Fee",
  },
};

const pageOptions = [8, 10, 20];

const statusClasses: Record<TxStatus, string> = {
  Pending: "bg-[#FFF4D1] text-[#F7941D]",
  Success: "bg-[#D6F9CC] text-[#4EAD2E]",
  Failed: "bg-[#FFD9DC] text-[#F03B46]",
  Passed: "bg-[#FFD9DC] text-[#F03B46]",
  "In Progress": "bg-[#FFD9DC] text-[#F03B46]",
};

const dotClasses: Record<TxStatus, string> = {
  Pending: "bg-[#F7941D]",
  Success: "bg-[#4EAD2E]",
  Failed: "bg-[#F03B46]",
  Passed: "bg-[#F03B46]",
  "In Progress": "bg-[#F03B46]",
};

const RecentTransactions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const totalPages = Math.max(1, Math.ceil(transactions.length / perPage));

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return transactions.slice(start, start + perPage);
  }, [currentPage, perPage]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const pageNumbers: (number | string)[] = [1, 2, 3, "...", totalPages];

  if (selectedTransaction) {
    const details = detailsByTransactionId[selectedTransaction.id] ?? {
      studentFirstName: selectedTransaction.studentName,
      studentLastName: "Decker",
      studentEmail: "liam@gmail.com",
      studentPhone: "+44 2598635900",
      agentFirstName: selectedTransaction.agentName,
      agentLastName: "Decker",
      agentEmail: "liam@gmail.com",
      agentPhone: "+44 2598635900",
      universityName: selectedTransaction.universityName,
      universityLocation: "Loughborough",
      universityEmail: "liam@gmail.com",
      universityPhone: "+44 2598635900",
      courseName: "Course Name",
      intake: "Date",
      startingDate: "Date",
      endingDate: "Date",
      tuitionFee: "Fee",
      firstTermFee: "Fee",
    };

    return (
      <section className="space-y-4 w-full max-w-full overflow-x-hidden">
        <button
          onClick={() => setSelectedTransaction(null)}
          className="text-white/80 hover:text-white text-sm"
        >
          ← Back to Recent Transactions
        </button>

        <div className="space-y-4">
          <div className="border border-[#343868] bg-[#14113A] p-7">
            <h3 className="text-white text-[36px] font-semibold uppercase">Student Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
              <p className="text-[30px]"><span className="font-semibold">First Name :</span> <span className="ml-8">{details.studentFirstName}</span></p>
                <p className="text-[30px]"><span className="font-semibold">Last Name :</span> <span className="ml-8">{details.studentLastName}</span></p>
                <p className="text-[30px]"><span className="font-semibold">Email ID :</span> <span className="ml-8">{details.studentEmail}</span></p>
                <p className="text-[30px]"><span className="font-semibold">Phone Number :</span> <span className="ml-8">{details.studentPhone}</span></p>
            </div>
          </div>

          <div className="border border-[#343868] bg-[#14113A] p-7">
            <h3 className="text-white text-[36px] font-semibold uppercase">Agent Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
              <p className="text-[30px]"><span className="font-semibold">First Name :</span> <span className="ml-8">{details.agentFirstName}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Last Name :</span> <span className="ml-8">{details.agentLastName}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Email ID :</span> <span className="ml-8">{details.agentEmail}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Phone Number :</span> <span className="ml-8">{details.agentPhone}</span></p>
            </div>
          </div>

          <div className="border border-[#343868] bg-[#14113A] p-7">
            <h3 className="text-white text-[36px] font-semibold uppercase">University Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
              <p className="text-[30px]"><span className="font-semibold">Name :</span> <span className="ml-8">{details.universityName}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Location :</span> <span className="ml-8">{details.universityLocation}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Email ID :</span> <span className="ml-8">{details.universityEmail}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Phone Number :</span> <span className="ml-8">{details.universityPhone}</span></p>
            </div>
          </div>

          <div className="border border-[#343868] bg-[#14113A] p-7">
            <h3 className="text-white text-[36px] font-semibold uppercase">Course Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
              <p className="text-[30px]"><span className="font-semibold">Corse Name :</span> <span className="ml-8">{details.courseName}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Intake :</span> <span className="ml-8">{details.intake}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Starting Date :</span> <span className="ml-8">{details.startingDate}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Ending Date :</span> <span className="ml-8">{details.endingDate}</span></p>
              <p className="text-[30px]"><span className="font-semibold">Tuition Fee:</span> <span className="ml-8">{details.tuitionFee}</span></p>
              <p className="text-[30px]"><span className="font-semibold">!st Term Fee :</span> <span className="ml-8">{details.firstTermFee}</span></p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl leading-tight font-semibold uppercase">Recent Transactions</h1>
        <button className="bg-[#F7941D] hover:bg-[#E38416] transition-colors text-white text-xs font-medium px-5 py-2.5 inline-flex items-center gap-2 border border-[#E28C28]">
          Download
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="border border-[#6A708D] overflow-hidden">
        <table className="w-full table-fixed bg-[#14113A]">
          <thead>
            <tr className="border-b border-[#6A708D]">
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Student Name</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Agent Name</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Uni Name</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Starting Date</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Ending Date</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Amount</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Status</th>
              <th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, idx) => (
              <tr key={`${row.studentName}-${idx}`} className="border-t border-[#6A708D]">
                <td className="px-2 py-3 text-center text-white text-[13px]">{row.studentName}</td>
                <td className="px-2 py-3 text-center text-white text-[13px]">{row.agentName}</td>
                <td className="px-2 py-3 text-center text-white text-[13px] wrap-break-word leading-tight">{row.universityName}</td>
                <td className="px-2 py-3 text-center text-white text-[13px]">{row.startDate}</td>
                <td className="px-2 py-3 text-center text-white text-[13px]">{row.endDate}</td>
                <td className="px-2 py-3 text-center text-white text-[13px] font-medium">{row.amount}</td>

                <td className="px-2 py-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusClasses[row.status]}`}>
                    <span className={`w-2 h-2 rounded-full ${dotClasses[row.status]}`} />
                    {row.status}
                  </span>
                </td>

                <td className="px-2 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedTransaction(row)}
                      className="w-7 h-7 rounded-md bg-[#F7941D] hover:bg-[#E38416] text-white inline-flex items-center justify-center transition-colors"
                      aria-label="View transaction"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-md bg-[#4761E5] hover:bg-[#3F57D2] text-white inline-flex items-center justify-center transition-colors" aria-label="Edit transaction">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} disabled={currentPage === 1} className="w-8 h-8 rounded-md border border-white/30 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={`${page}-${idx}`}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-sm font-medium inline-flex items-center justify-center ${
                  currentPage === page ? "bg-[#F7941D] text-white" : "text-white hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={`dots-${idx}`} className="text-white/70 px-1 text-sm">
                {page}
              </span>
            ),
          )}

          <button onClick={goNext} disabled={currentPage === totalPages} className="w-8 h-8 rounded-md border border-white/30 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, transactions.length)} of {transactions.length} entries
          </span>

          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="inline-flex items-center gap-1.5 bg-[#14113A] border border-[#6A708D] text-white text-xs px-3 py-2"
            >
              Show {perPage}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 bottom-10 min-w-[82px] bg-[#14113A] border border-[#6A708D] z-20">
                {pageOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setPerPage(option);
                      setCurrentPage(1);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                      perPage === option ? "bg-[#F7941D] text-white" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentTransactions;
