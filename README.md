# Cash Flow Manager Application

This is a backend service application for managing user accounts and transactions.

## Features

- User authentication with third-party services (Supabase, etc.).
- Management of payment accounts including credit, debit, and loan accounts.
- Recording and management of payment transactions.
- API endpoints for sending and withdrawing funds.
- API endpoint for retrieving transaction history for a specific account.

## Tech Stack

- **Node.js**: Backend server using Fastify framework.
- **Prisma**: ORM for PostgreSQL.
- **Docker**: Containerization of the application.
- **Supabase**: Third-party authentication service.

## Pre-requisites

- Docker

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/payment-service.git
    ```

2. Set up environment variables:

    Create a `.env` file in the root directory and configure the following variables:

    ```env
    SUPABASE_URL=your_database_url
    DATABASE_URL=your_database_url
    ANONYMOUS_PUBLIC_KEY=your_supabase_api_key
    ```

    
    Run Prisma migrations:
    
    ```bash
    prisma migrate dev
    ```

## Running the Application

```bash
docker-compose up -d --build
```

## API Documentation

##### URL for local developement: http://localhost:3000/

## <a name="_ji2na6is5znm"></a>**Authentication**
#### <a name="_oqfl89b3uraa"></a>**1. Signup**
- **Method:** POST
- **URL:** /signup
- **Request Body:**
  - email: User's email address (string)
  - password: User's password (string)
- **Response:**
  - **Success (201 Created):**
    - user: Object containing user information created in Prisma (optional, depending on your implementation).
    - session: Supabase session object containing user authentication details.
  - **Error (500 Internal Server Error):**
    - error: Message describing the error that occurred.
#### <a name="_1pbsgp9uzl7q"></a>**2. Login**
- **Method:** POST
- **URL:** /login
- **Request Body:**
  - email: User's email address (string)
  - password: User's password (string)
- **Response:**
  - **Success (200 OK):**
    - session: Supabase session object containing user authentication details.
  - **Error (500 Internal Server Error):**
    - error: Message describing the error that occurred.
#### <a name="_jv3sxnfrphbn"></a>**3. Logout**
- **Method:** POST
- **URL:** /logout
- **Request Body:** None
- **Response:**
  - **Success (200 OK):**
    - User logged out: String message indicating successful logout.
  - **Error (500 Internal Server Error):**
    - error: Message describing the error that occurred.

## <a name="_lpk0lonmeql7"></a>**Payment Accounts**
#### <a name="_pxlts0gz2p7s"></a>**1. Create Payment Account (POST /payment-accounts)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **Request Body:**
  - accountType: String representing the type of payment account (e.g., "checking", "savings").
  - balance: Number representing the initial balance of the account.
- **Response:**
  - **Success (201 Created):**
    - paymentAccount: Object containing details of the newly created payment account.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered during creation.
#### <a name="_ceagmmuhm2fy"></a>**2. Get All Payment Accounts (GET /payment-accounts)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **Response:**
  - **Success (200 OK):**
    - paymentAccounts: Array containing objects of all payment accounts associated with the authenticated user.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered while retrieving accounts.
#### <a name="_efj07652dwso"></a>**3. Get Payment Account by ID (GET /payment-accounts/:id)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **URL Parameter:**
  - id: Integer representing the unique identifier of the payment account.
- **Response:**
  - **Success (200 OK):**
    - paymentAccount: Object containing details of the retrieved payment account (if found).
  - **Error (404 Not Found):**
    - error: String message indicating the payment account with the specified ID was not found.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered while retrieving the account.
#### <a name="_i3o945ogdinr"></a>**4. Top-up Payment Account (PUT /payment-accounts/:id/topup)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **URL Parameter:**
  - id: Integer representing the unique identifier of the payment account.
- **Request Body:**
  - amount: Number representing the amount to add to the account balance.
- **Response:**
  - **Success (200 OK):**
    - updatedPaymentAccount: Object containing details of the payment account after the top-up, including the new balance.
  - **Error (404 Not Found):**
    - error: String message indicating the payment account with the specified ID was not found.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered during top-up.
#### <a name="_4jdi89c8i8q"></a>**5. Delete Payment Account (DELETE /payment-accounts/:id)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **URL Parameter:**
  - id: Integer representing the unique identifier of the payment account to delete.
- **Response:**
  - **Success (200 OK):**
    - message: String message indicating successful deletion of the payment account.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered while deleting the account.

## <a name="_i4irbwkoirdy"></a>**Transaction History**
### <a name="_3p4dd8v8slxb"></a>**Endpoint**
#### <a name="_tq81y87vtdk9"></a>**1. Get Transaction History (GET /transactions/:accountId)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **URL Parameter:**
  - accountId: Integer representing the unique identifier of the payment account for which to retrieve transaction history.
- **Response:**
  - **Success (200 OK):**
    - transactions: Array containing objects of all transactions associated with the specified payment account and the authenticated user (based on userId).
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered while retrieving transactions.

## <a name="_yg8b3356alqt"></a>**Transactions (Send & Withdraw)**
### <a name="_pia3zrd441qh"></a>**Endpoints**
#### <a name="_qnc0ysl6bj00"></a>**1. Send Money (POST /send)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **Request Body:**
  - accountId: Integer representing the unique identifier of the account to send money from.
  - amount: Number representing the amount of money to send.
  - recipient: String representing the recipient of the transfer (optional).
  - currency: String representing the currency of the transaction (e.g., "USD", "IDR").
- **Response:**
  - **Success (200 OK):**
    - message: String indicating successful transaction.
    - transaction: Object containing details of the created payment history record.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered during transaction processing.
#### <a name="_rf4sn4dl56kh"></a>**2. Withdraw Money (POST /withdraw)**
- Requires user authentication (validated by preHandler: validateSession).

  **Accessing this endpoint requires first logging in through the /login endpoint to validate your identity on the backend, please log in if you haven't already.**

- **Request Body:** (Same as Send Money)
  - accountId: Integer representing the unique identifier of the account to withdraw money from.
  - amount: Number representing the amount of money to withdraw.
  - recipient: String representing the recipient of the transfer (optional).
  - currency: String representing the currency of the transaction (e.g., "USD", "IDR").
- **Response:**
  - **Success (200 OK):**
    - message: String indicating successful withdrawal.
    - transaction: Object containing details of the created payment history record.
  - **Error (500 Internal Server Error):**
    - error: String message describing the error encountered during transaction processing.
