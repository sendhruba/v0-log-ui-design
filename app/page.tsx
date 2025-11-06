import { LogViewer, type LogEntry } from "@/components/log-viewer"

// Sample log data for demonstration with parent-child relationships
const sampleLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2025-01-15 14:32:18.234",
    method: "POST",
    endpoint: "/api/users/create",
    status: 201,
    duration: 145,
    request: {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      body: {
        username: "john_doe",
        email: "john@example.com",
        role: "admin",
      },
    },
    response: {
      success: true,
      data: {
        id: "usr_1234567890",
        username: "john_doe",
        email: "john@example.com",
        role: "admin",
        createdAt: "2025-01-15T14:32:18.234Z",
      },
      message: "User created successfully",
    },
    children: [
      {
        id: "1-1",
        timestamp: "2025-01-15 14:32:18.245",
        method: "POST",
        endpoint: "db.users.insert",
        status: 201,
        duration: 23,
        request: {
          operation: "INSERT",
          table: "users",
          data: {
            username: "john_doe",
            email: "john@example.com",
            role: "admin",
            password_hash: "$2b$10$...",
          },
        },
        response: {
          insertedId: "usr_1234567890",
          rowsAffected: 1,
        },
        children: [
          {
            id: "1-1-1",
            timestamp: "2025-01-15 14:32:18.248",
            method: "POST",
            endpoint: "db.transaction.begin",
            status: 200,
            duration: 3,
            request: {
              isolationLevel: "READ_COMMITTED",
            },
            response: {
              transactionId: "txn_abc123",
            },
          },
          {
            id: "1-1-2",
            timestamp: "2025-01-15 14:32:18.265",
            method: "POST",
            endpoint: "db.transaction.commit",
            status: 200,
            duration: 5,
            request: {
              transactionId: "txn_abc123",
            },
            response: {
              committed: true,
            },
          },
        ],
      },
      {
        id: "1-2",
        timestamp: "2025-01-15 14:32:18.289",
        method: "POST",
        endpoint: "cache.set",
        status: 200,
        duration: 12,
        request: {
          key: "user:usr_1234567890",
          value: {
            id: "usr_1234567890",
            username: "john_doe",
            email: "john@example.com",
          },
          ttl: 3600,
        },
        response: {
          success: true,
          cached: true,
        },
      },
      {
        id: "1-3",
        timestamp: "2025-01-15 14:32:18.312",
        method: "POST",
        endpoint: "external.sendgrid.send",
        status: 200,
        duration: 89,
        request: {
          to: "john@example.com",
          template: "welcome_email",
          data: {
            username: "john_doe",
          },
        },
        response: {
          messageId: "msg_abc123",
          status: "queued",
        },
        children: [
          {
            id: "1-3-1",
            timestamp: "2025-01-15 14:32:18.320",
            method: "POST",
            endpoint: "external.sendgrid.auth",
            status: 200,
            duration: 45,
            request: {
              apiKey: "SG.***",
            },
            response: {
              authenticated: true,
            },
          },
          {
            id: "1-3-2",
            timestamp: "2025-01-15 14:32:18.378",
            method: "POST",
            endpoint: "external.sendgrid.queue",
            status: 200,
            duration: 23,
            request: {
              messageId: "msg_abc123",
              priority: "normal",
            },
            response: {
              queued: true,
              position: 42,
            },
          },
        ],
      },
    ],
  },
  {
    id: "2",
    timestamp: "2025-01-15 14:31:45.123",
    method: "GET",
    endpoint: "/api/products?category=electronics&limit=20",
    status: 200,
    duration: 89,
    request: {
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": "req_abc123def456",
      },
      query: {
        category: "electronics",
        limit: 20,
        offset: 0,
      },
    },
    response: {
      success: true,
      data: [
        {
          id: "prod_001",
          name: "Wireless Headphones",
          price: 99.99,
          stock: 45,
        },
        {
          id: "prod_002",
          name: "Smart Watch",
          price: 249.99,
          stock: 23,
        },
      ],
      pagination: {
        total: 156,
        limit: 20,
        offset: 0,
      },
    },
    children: [
      {
        id: "2-1",
        timestamp: "2025-01-15 14:31:45.134",
        method: "GET",
        endpoint: "cache.get",
        status: 404,
        duration: 8,
        request: {
          key: "products:electronics:0:20",
        },
        response: {
          found: false,
          message: "Cache miss",
        },
      },
      {
        id: "2-2",
        timestamp: "2025-01-15 14:31:45.156",
        method: "GET",
        endpoint: "db.products.query",
        status: 200,
        duration: 67,
        request: {
          operation: "SELECT",
          table: "products",
          where: {
            category: "electronics",
          },
          limit: 20,
          offset: 0,
        },
        response: {
          rows: 2,
          data: [
            { id: "prod_001", name: "Wireless Headphones" },
            { id: "prod_002", name: "Smart Watch" },
          ],
        },
        children: [
          {
            id: "2-2-1",
            timestamp: "2025-01-15 14:31:45.165",
            method: "GET",
            endpoint: "db.connection.acquire",
            status: 200,
            duration: 12,
            request: {
              pool: "read-replica",
            },
            response: {
              connectionId: "conn_789",
            },
          },
          {
            id: "2-2-2",
            timestamp: "2025-01-15 14:31:45.210",
            method: "POST",
            endpoint: "db.connection.release",
            status: 200,
            duration: 3,
            request: {
              connectionId: "conn_789",
            },
            response: {
              released: true,
            },
          },
        ],
      },
      {
        id: "2-3",
        timestamp: "2025-01-15 14:31:45.198",
        method: "POST",
        endpoint: "cache.set",
        status: 200,
        duration: 14,
        request: {
          key: "products:electronics:0:20",
          ttl: 300,
        },
        response: {
          success: true,
          cached: true,
        },
      },
    ],
  },
  {
    id: "3",
    timestamp: "2025-01-15 14:30:12.567",
    method: "DELETE",
    endpoint: "/api/sessions/usr_9876543210",
    status: 204,
    duration: 34,
    request: {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "X-Request-ID": "req_xyz789ghi012",
      },
      params: {
        userId: "usr_9876543210",
      },
    },
    response: {
      success: true,
      message: "Session terminated successfully",
    },
    children: [
      {
        id: "3-1",
        timestamp: "2025-01-15 14:30:12.578",
        method: "DELETE",
        endpoint: "db.sessions.delete",
        status: 200,
        duration: 18,
        request: {
          operation: "DELETE",
          table: "sessions",
          where: {
            userId: "usr_9876543210",
          },
        },
        response: {
          rowsAffected: 3,
        },
      },
      {
        id: "3-2",
        timestamp: "2025-01-15 14:30:12.589",
        method: "DELETE",
        endpoint: "cache.delete",
        status: 200,
        duration: 16,
        request: {
          pattern: "session:usr_9876543210:*",
        },
        response: {
          deleted: 3,
        },
      },
    ],
  },
  {
    id: "4",
    timestamp: "2025-01-15 14:29:33.891",
    method: "PUT",
    endpoint: "/api/orders/ord_555/status",
    status: 200,
    duration: 112,
    request: {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      body: {
        status: "shipped",
        trackingNumber: "TRK123456789",
        carrier: "FedEx",
      },
    },
    response: {
      success: true,
      data: {
        orderId: "ord_555",
        status: "shipped",
        trackingNumber: "TRK123456789",
        updatedAt: "2025-01-15T14:29:33.891Z",
      },
    },
    children: [
      {
        id: "4-1",
        timestamp: "2025-01-15 14:29:33.902",
        method: "PUT",
        endpoint: "db.orders.update",
        status: 200,
        duration: 34,
        request: {
          operation: "UPDATE",
          table: "orders",
          where: { id: "ord_555" },
          data: {
            status: "shipped",
            trackingNumber: "TRK123456789",
            carrier: "FedEx",
          },
        },
        response: {
          rowsAffected: 1,
        },
      },
      {
        id: "4-2",
        timestamp: "2025-01-15 14:29:33.945",
        method: "POST",
        endpoint: "external.twilio.sms",
        status: 200,
        duration: 56,
        request: {
          to: "+1234567890",
          message: "Your order #ord_555 has been shipped! Track: TRK123456789",
        },
        response: {
          sid: "SM1234567890",
          status: "sent",
        },
        children: [
          {
            id: "4-2-1",
            timestamp: "2025-01-15 14:29:33.952",
            method: "POST",
            endpoint: "external.twilio.validate",
            status: 200,
            duration: 23,
            request: {
              phoneNumber: "+1234567890",
            },
            response: {
              valid: true,
              carrier: "Verizon",
            },
          },
          {
            id: "4-2-2",
            timestamp: "2025-01-15 14:29:33.989",
            method: "POST",
            endpoint: "external.twilio.deliver",
            status: 200,
            duration: 12,
            request: {
              sid: "SM1234567890",
            },
            response: {
              delivered: true,
            },
          },
        ],
      },
      {
        id: "4-3",
        timestamp: "2025-01-15 14:29:33.978",
        method: "POST",
        endpoint: "queue.publish",
        status: 200,
        duration: 22,
        request: {
          queue: "order-analytics",
          event: "order_shipped",
          data: {
            orderId: "ord_555",
            timestamp: "2025-01-15T14:29:33.891Z",
          },
        },
        response: {
          messageId: "msg_queue_789",
          queued: true,
        },
      },
    ],
  },
  {
    id: "5",
    timestamp: "2025-01-15 14:28:05.234",
    method: "POST",
    endpoint: "/api/auth/login",
    status: 401,
    duration: 67,
    request: {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: {
        email: "user@example.com",
        password: "********",
      },
    },
    response: {
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        timestamp: "2025-01-15T14:28:05.234Z",
      },
    },
    children: [
      {
        id: "5-1",
        timestamp: "2025-01-15 14:28:05.245",
        method: "GET",
        endpoint: "db.users.findByEmail",
        status: 200,
        duration: 28,
        request: {
          operation: "SELECT",
          table: "users",
          where: { email: "user@example.com" },
        },
        response: {
          found: true,
          userId: "usr_999",
        },
      },
      {
        id: "5-2",
        timestamp: "2025-01-15 14:28:05.267",
        method: "POST",
        endpoint: "auth.verifyPassword",
        status: 401,
        duration: 23,
        request: {
          userId: "usr_999",
          passwordHash: "$2b$10$...",
        },
        response: {
          valid: false,
        },
      },
      {
        id: "5-3",
        timestamp: "2025-01-15 14:28:05.289",
        method: "POST",
        endpoint: "db.login_attempts.insert",
        status: 201,
        duration: 16,
        request: {
          operation: "INSERT",
          table: "login_attempts",
          data: {
            userId: "usr_999",
            success: false,
            ipAddress: "192.168.1.100",
          },
        },
        response: {
          insertedId: "attempt_123",
        },
      },
    ],
  },
  {
    id: "6",
    timestamp: "2025-01-15 14:27:22.456",
    method: "GET",
    endpoint: "/api/analytics/dashboard",
    status: 500,
    duration: 2345,
    request: {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "X-Request-ID": "req_error123",
      },
      query: {
        dateRange: "last_30_days",
        metrics: ["revenue", "users", "orders"],
      },
    },
    response: {
      success: false,
      error: {
        code: "DATABASE_CONNECTION_ERROR",
        message: "Failed to connect to analytics database",
        details: "Connection timeout after 2000ms",
        timestamp: "2025-01-15T14:27:22.456Z",
      },
    },
    children: [
      {
        id: "6-1",
        timestamp: "2025-01-15 14:27:22.467",
        method: "GET",
        endpoint: "db.analytics.connect",
        status: 500,
        duration: 2000,
        request: {
          host: "analytics-db.internal",
          port: 5432,
          database: "analytics",
        },
        response: {
          error: "Connection timeout",
          details: "No response from host after 2000ms",
        },
        children: [
          {
            id: "6-1-1",
            timestamp: "2025-01-15 14:27:22.470",
            method: "GET",
            endpoint: "network.dns.resolve",
            status: 200,
            duration: 45,
            request: {
              hostname: "analytics-db.internal",
            },
            response: {
              ip: "10.0.1.25",
            },
          },
          {
            id: "6-1-2",
            timestamp: "2025-01-15 14:27:22.520",
            method: "POST",
            endpoint: "network.tcp.connect",
            status: 500,
            duration: 1947,
            request: {
              host: "10.0.1.25",
              port: 5432,
              timeout: 2000,
            },
            response: {
              error: "Connection timeout",
            },
          },
        ],
      },
      {
        id: "6-2",
        timestamp: "2025-01-15 14:27:24.478",
        method: "POST",
        endpoint: "monitoring.alert",
        status: 200,
        duration: 45,
        request: {
          severity: "critical",
          service: "analytics-api",
          message: "Database connection failed",
        },
        response: {
          alertId: "alert_456",
          notified: ["ops-team"],
        },
      },
    ],
  },
  {
    id: "7",
    timestamp: "2025-01-15 14:26:18.789",
    method: "PATCH",
    endpoint: "/api/users/usr_1234567890/profile",
    status: 200,
    duration: 98,
    request: {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      body: {
        displayName: "John Doe",
        bio: "Software Engineer | Tech Enthusiast",
        avatar: "https://example.com/avatars/john.jpg",
      },
    },
    response: {
      success: true,
      data: {
        id: "usr_1234567890",
        displayName: "John Doe",
        bio: "Software Engineer | Tech Enthusiast",
        avatar: "https://example.com/avatars/john.jpg",
        updatedAt: "2025-01-15T14:26:18.789Z",
      },
    },
    children: [
      {
        id: "7-1",
        timestamp: "2025-01-15 14:26:18.801",
        method: "PATCH",
        endpoint: "db.users.update",
        status: 200,
        duration: 45,
        request: {
          operation: "UPDATE",
          table: "users",
          where: { id: "usr_1234567890" },
          data: {
            displayName: "John Doe",
            bio: "Software Engineer | Tech Enthusiast",
            avatar: "https://example.com/avatars/john.jpg",
          },
        },
        response: {
          rowsAffected: 1,
        },
      },
      {
        id: "7-2",
        timestamp: "2025-01-15 14:26:18.856",
        method: "DELETE",
        endpoint: "cache.invalidate",
        status: 200,
        duration: 31,
        request: {
          keys: ["user:usr_1234567890", "profile:usr_1234567890"],
        },
        response: {
          invalidated: 2,
        },
      },
    ],
  },
]

export default function Page() {
  return <LogViewer logs={sampleLogs} />
}
