# System Architecture

## System Diagram
```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant B as Express Backend
    participant LLM as Anthropic API
    participant DB as Supabase

    U->>F: Enters AI tools & spend
    F->>F: Audit Engine Calculates Savings
    F->>B: Sends audit data
    B->>LLM: Requests 100-word summary
    LLM-->>B: Returns personalized summary
    B-->>F: Returns summary & displays results
    U->>F: Submits Email for full report
    F->>B: Sends lead data
    B->>DB: Stores email & audit ID
    B-->>F: Returns unique Share ID
    F-->>U: Generates public Shareable URL