import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import Users from "../pages/user/Users";
import NewUser from "../pages/user/NewUser";
import Error404 from "../pages/error/Error404";
import UpdateUser from "../pages/user/updateuser/UpdateUser";
import Seller from "../pages/seller/Sellers";
import SellerLayout from "../layouts/SellerLayout";
import SellerRequests from "../pages/seller/SellerRequests";
import UpdateSeller from "../pages/seller/UpdateSeller";
import ProductLayout from "../layouts/ProductLayout";
import Products from "../pages/product/Products";
import UpdateProduct from "../pages/product/UpdateProduct";
import TicketLayout from "../layouts/TicketLayout";
import Tickets from "../pages/ticket/Tickets";
import UpdateTicket from "../pages/ticket/UpdateTicket";
import OrderRefundLayout from "../layouts/OrderRefundLayout";
import OrderRefund from "../pages/order/OrderRefund";
import Transactions from "../pages/transaction/Transactions";
import TransactionsLayout from "../layouts/TransactionLayout";
import WithdrawalRequestLayout from "../layouts/WithdrawalRequest";
import WithdrawalRequest from "../pages/payroll/WithdrawalRequest";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/login";
import NewSellerDeatils from "../pages/seller/NewSellerDeatils";
import RefundDetails from "../pages/order/RefundDetails";
import SellerTransactions from "../pages/transaction/SellerTransactions";
import TicketMasters from "../pages/ticket/TicketMasters";
import DatabasesLayout from "../layouts/DatabasesLayout";
import AdminDatabase from "../pages/databases/AdminDatabase";
import SuperAdminDatabase from "../pages/databases/SuperAdminDatabase";
import LogsLayout from "../layouts/LogsLayout";
// import UserLogs from "../pages/logs/UserLogs";
// import AdminLogs from "../pages/logs/AdminLogs";
// import SuperAdminLogs from "../pages/logs/SuperAdminLogs";
// import ErrorLogs from "../pages/logs/ErrorLogs";
// import SellerLogs from "../pages/logs/SellerLogs";
// import TicketMasterLogs from "../pages/logs/TicketMasterLogs";



const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Dashboard />
          </>
        ),
      },
      {
        path: "/user",
        element: (
          <>
            <UserLayout>
              <Users />
            </UserLayout>
          </>
        ),
      },
      {
        path: "/newuser",
        element: (
          <>
            <UserLayout>
              <NewUser />
            </UserLayout>
          </>
        ),
      },
      {
        path: "/updateuser/:userId",
        element: (
          <>
            <UserLayout>
              <UpdateUser />
            </UserLayout>
          </>
        ),
      },
      {
        path: "/seller",
        element: (
          <>
            <SellerLayout>
              <Seller />
            </SellerLayout>
          </>
        ),
      },
      {
        path: "/sellerrequests",
        element: (
          <>
            <SellerLayout>
              <SellerRequests />
            </SellerLayout>
          </>
        ),
      },
      {
        path: "/newsellerdetails/:newSellerId",
        element: (
          <>
            <SellerLayout>
              <NewSellerDeatils />
            </SellerLayout>
          </>
        ),
      },
      {
        path: "/updateseller/:sellerId",
        element: (
          <>
            <SellerLayout>
              <UpdateSeller />
            </SellerLayout>
          </>
        ),
      },
      {
        path: "/product",
        element: (
          <>
            <ProductLayout>
              <Products />
            </ProductLayout>
          </>
        ),
      },
      {
        path: "/updateproduct/:productId",
        element: (
          <>
            <ProductLayout>
              <UpdateProduct />
            </ProductLayout>
          </>
        ),
      },
      {
        path: "/ticket",
        element: (
          <>
            <TicketLayout>
              <Tickets />
            </TicketLayout>
          </>
        ),
      },
      {
        path: "/ticketmasters",
        element: (
          <>
            <TicketLayout>
              <TicketMasters />
            </TicketLayout>
          </>
        ),
      },
      {
        path: "/updateticket/:ticketId",
        element: (
          <>
            <TicketLayout>
              <UpdateTicket />
            </TicketLayout>
          </>
        ),
      },
      {
        path: "/orderrefund",
        element: (
          <>
            <OrderRefundLayout>
              <OrderRefund />
            </OrderRefundLayout>
          </>
        ),
      },
      {
        path: "/refunddetails/:refundId",
        element: (
          <>
            <OrderRefundLayout>
              <RefundDetails />
            </OrderRefundLayout>
          </>
        ),
      },
      {
        path: "/transaction",
        element: (
          <>
            <TransactionsLayout>
              <Transactions />
            </TransactionsLayout>
          </>
        ),
      },
      {
        path: "/sellertransaction",
        element: (
          <>
            <TransactionsLayout>
              <SellerTransactions />
            </TransactionsLayout>
          </>
        ),
      },
      {
        path: "/payroll",
        element: (
          <>
            <WithdrawalRequestLayout>
              <WithdrawalRequest />
            </WithdrawalRequestLayout>
          </>
        ),
      },
      {
        path: "/databases",
        element: (
          <>
            <DatabasesLayout>
              <AdminDatabase />
            </DatabasesLayout>
          </>
        ),
      },
      {
        path: "/superadmindatabase",
        element: (
          <>
            <DatabasesLayout>
              <SuperAdminDatabase />
            </DatabasesLayout>
          </>
        ),
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default createBrowserRouter(routes);
