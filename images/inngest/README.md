# inngest

Container image for [inngest](https://github.com/inngest/inngest)

## Usage

```shell
docker run -p 8288:8288 -p 8289:8289 -e INNGEST_EVENT_KEY=abcd -e INNGEST_SIGNING_KEY=1234 harryzcy/inngest
```

## Environment variables

  - `INNGEST_EVENT_KEY`: `your_event_key_here # Must be hex string with even number of chars`
  - `INNGEST_SIGNING_KEY`: `your_signing_key_here # Must be hex string with even number of chars`
  - `INNGEST_POSTGRES_URI`: `postgres://inngest:password@postgres:5432/inngest`
  - `INNGEST_REDIS_URI`: `redis://redis:6379`
