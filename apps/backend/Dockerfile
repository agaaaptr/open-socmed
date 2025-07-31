# Stage 1: Build the Go application
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./go.mod go.sum
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the application
# CGO_ENABLED=0 is important for static linking, making the binary self-contained
# -o dist/main specifies the output path and name for the executable
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o dist/main main.go

# Stage 2: Create the final, minimal image
FROM alpine:latest

# Set the working directory
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/dist/main .

# Expose the port your Go application listens on (from main.go)
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
