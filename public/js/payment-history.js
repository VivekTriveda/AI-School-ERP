async function loadPaymentHistory() {

    const tableBody =
        document.getElementById("paymentTableBody");

    try {

        const response = await fetch(
            "/api/subscription-payment/history"
        );

        const result = await response.json();

        if (!result.success) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load payment history.
                    </td>
                </tr>
            `;

            return;
        }


        const payments = result.payments || [];


        /* =========================================
           SUMMARY
        ========================================= */

        const successfulPayments =
            payments.filter(
                payment =>
                    payment.status === "paid"
            );


        const totalRevenue =
            successfulPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        document.getElementById(
            "totalPayments"
        ).textContent = payments.length;


        document.getElementById(
            "successfulPayments"
        ).textContent =
            successfulPayments.length;


        document.getElementById(
            "totalRevenue"
        ).textContent =
            "₹" +
            totalRevenue.toLocaleString("en-IN");


        /* =========================================
           TABLE
        ========================================= */

        if (payments.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No payment records found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        payments.forEach(payment => {

            const row =
                document.createElement("tr");


            const packageName =
                payment.planName ||
                payment.plan ||
                "-";


            const amount =
                Number(
                    payment.amount || 0
                ).toLocaleString("en-IN");


            const date =
                payment.paidAt ||
                payment.createdAt;


            const formattedDate =
                date
                    ? new Date(date)
                        .toLocaleString("en-IN")
                    : "-";


            const status =
                payment.status || "created";


            const statusClass =
                status === "paid"
                    ? "paid"
                    : status === "failed"
                        ? "failed"
                        : "pending";


            row.innerHTML = `

                <td>
                    <strong>
                        ${payment.schoolName || "-"}
                    </strong>
                </td>

                <td>
                    <span class="package-badge">
                        ${packageName}
                    </span>
                </td>

                <td>
                    <strong>
                        ₹${amount}
                    </strong>
                </td>

                <td>
                    <span class="payment-id">
                        ${payment.razorpayPaymentId || "-"}
                    </span>
                </td>

                <td>
                    ${formattedDate}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${status.toUpperCase()}
                    </span>
                </td>

            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Payment history error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to connect to payment server.
                </td>
            </tr>
        `;
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadPaymentHistory
);