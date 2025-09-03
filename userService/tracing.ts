import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';


const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'user-service', 
  }),
});


const exporter = new ZipkinExporter({
  url: 'http://localhost:9411/api/v2/spans', 
});


provider.addSpanProcessor(new BatchSpanProcessor(exporter));


registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  provider.register();
  console.log('Tracing initialized and provider registered.');
} catch (error) {
  console.error('Error initializing tracing:', error);
}

console.log('Tracing setup completed.');
