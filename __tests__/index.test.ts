import { hclToJson } from '../src/index';

describe('hcl-unmarshal / hclToJson', () => {
    it('parses a simple labeled block (variable)', () => {
        const hcl = `
      variable "region" {
        type    = string
        default = "us-west-2"
      }
    `;
        expect(hclToJson(hcl)).toEqual({
            variable: [
                {
                    region: [
                        {
                            type: 'string',
                            default: 'us-west-2',
                        },
                    ],
                },
            ],
        });
    });

    it('parses a resource with nested block and list of strings', () => {
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
        expect(hclToJson(hcl)).toEqual({
            resource: [
                {
                    aws_instance: [
                        {
                            web: [
                                {
                                    ami: 'ami-123',
                                    tags: ['web', 'prod'],
                                    network_interface: [
                                        {
                                            device_index: 0,
                                            network_id: 'net-abc',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('parses nested arrays correctly', () => {
        const hcl = `
      cue {
        text = [
          ["matte",   0],
          ["nai ", 300],
          ["de ",  550]
        ]
      }
    `;
        expect(hclToJson(hcl)).toEqual({
            cue: [
                {
                    text: [
                        ['matte', 0],
                        ['nai ', 300],
                        ['de ', 550],
                    ],
                },
            ],
        });
    });

    it('parses a locals block with array of objects', () => {
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
        expect(hclToJson(hcl)).toEqual({
            locals: [
                {
                    servers: [
                        { name: 'frontend', port: 80 },
                        { name: 'backend', port: 8080 },
                    ],
                },
            ],
        });
    });
});
