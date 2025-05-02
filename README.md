# hcl-unmarshal

A zero-dependency TypeScript library for parsing HashiCorp Configuration Language (HCL) v1 into plain JavaScript objects. Works out-of-the-box in Node.js, modern browsers, and React Native.

---

## 🔍 Features

- **Full HCL v1 support**  
  Labels, blocks, nested blocks  
  Scalar assignments, maps, nested arrays  
  Heredoc / multiline strings
- **Pure JS/TS implementation**  
  No native modules, no WebAssembly—just install and import
- **Accurate recursive-descent parser**  
  Faithfully reproduces HCL’s AST shape as JSON
- **Built-in TypeScript definitions**  
  Type-safe imports & IntelliSense support

---

## 🚀 Installation

```bash
npm i hcl-unmarshal
# or
pnpm i hcl-unmarshal
```

---

## 💡 Quick Start

```ts
import { hclToJson } from 'hcl-unmarshal';

const hcl = `
variable "env" {
  default = "production"
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-app-data"
  acl    = "private"

  tags = ["app", "data"]
}
`;

console.log(JSON.stringify(hclToJson(hcl)));
```

**Result:**

```json
{
    "variable": [
        {
            "env": [
                {
                    "default": "production"
                }
            ]
        }
    ],
    "resource": [
        {
            "aws_s3_bucket": [
                {
                    "my_bucket": [
                        {
                            "bucket": "my-app-data",
                            "acl": "private",
                            "tags": ["app", "data"]
                        }
                    ]
                }
            ]
        }
    ]
}
```

---

## 📚 API

### `hclToJson(input: string): Record<string, any>`

Parses an HCL string (v1) into a nested JS object/array structure.

- **input**: full HCL document as a single string
- **returns**: a JSON-compatible object reflecting your HCL blocks, labels, and values

---

## 🛠️ Examples

### 1. Variables & Maps

```ts
const hcl = `
variable "region" {
  type    = string
  default = "us-west-2"
}

variable "tags" {
  type    = map(string)
  default = {
    Env  = "prod"
    Team = "devops"
  }
}
`;

console.log(JSON.stringify(hclToJson(hcl)));
```

**Result:**

```json
{
    "variable": [
        {
            "region": [
                {
                    "type": "string",
                    "default": "us-west-2"
                }
            ]
        },
        {
            "tags": [
                {
                    "type": "map(string)",
                    "default": {
                        "Env": "prod",
                        "Team": "devops"
                    }
                }
            ]
        }
    ]
}
```

---

### 2. Resource with Nested Blocks & Lists

```ts
const hcl = `
resource "aws_instance" "web" {
  ami  = "ami-123"
  tags = ["web", "prod"]

  network_interface {
    device_index = 0
    network_id   = "net-abc"
  }
}
`;

console.log(JSON.stringify(hclToJson(hcl));
```

**Result:**

```json
{
    "resource": [
        {
            "aws_instance": [
                {
                    "web": [
                        {
                            "ami": "ami-123",
                            "tags": ["web", "prod"],
                            "network_interface": [
                                {
                                    "device_index": 0,
                                    "network_id": "net-abc"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```

---

### 3. Locals with Nested Arrays & Objects

```ts
const hcl = `
locals {
  servers = [
    {
      name = "frontend"
      port = 80
    },
    {
      name = "backend"
      port = 8080
    }
  ]
}
`;

console.log(JSON.stringify(hclToJson(hcl)));
```

**Result:**

```json
{
    "locals": [
        {
            "servers": [
                {
                    "name": "frontend",
                    "port": 80
                },
                {
                    "name": "backend",
                    "port": 8080
                }
            ]
        }
    ]
}
```

---

## 🧑‍💻 Development

1. **Clone** the repo
2. **Install** dependencies

    ```bash
    pnpm i
    ```

3. **Build**

    ```bash
    pnpm build
    ```

4. **Test**

    ```bash
    pnpx jest
    ```

---

## 🤝 Contributing

Contributions welcome! Please open issues or pull requests for bugs, feature requests, or improvements.

---

## 📜 License

Distributed under the **MIT** License. See [`LICENSE`](LICENSE) for details.
