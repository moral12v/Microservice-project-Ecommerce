import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Tracing setup
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'user-service', 
  }),
});

const exporter = new ZipkinExporter({
  url: 'http://localhost:9411/api/v2/spans', 
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register();
    console.log('Tracing initialized.');
registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations()],
});

console.log('Tracing setup completed.');


