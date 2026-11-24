# Kramavriddhi Learn — Card writer brief

Read `REVIEWER.md` (same folder) section 2 for the product and section 3 for the quality bar: an expert reviewer checks every card you write against it.

## Output
ONE file (path given in your task):
```js
module.exports = {
  'aws.b.01': [ /* cards */ ],
  ...
};
```
Plain JavaScript object literals; double quotes for strings that contain a single quote. No other code.

## Each unit (in this order inside its array)
1. Exactly **one `learn` card first** (the units are new and empty).
2. Practice cards so the unit has **6 to 8 non-checkpoint cards in total** (aim for 7), using at least 3 different types.
3. Exactly **2 `check` cards last** covering the whole unit.
4. Each skill needs **at least two mini games** (`pipe` or `indent`) across its units.

## Card formats
- `{ t: 'learn', title, body, code?, lang? }` — body 2–3 short sentences, `backticks` for commands/code, **bold** for key words; code 1–5 lines.
- `{ t: 'choice', q, a, w: [3 wrong], why }`
- `{ t: 'output', q?, code, lang, a, w, why }` — only when the output is certain (SQL that runs the same in SQLite, or shown in official docs).
- `{ t: 'bug', q, code: [lines], lang, bad: 0-based index, why, fix: "corrected line" }` — exactly one wrong line; question says what goes wrong.
- `{ t: 'order', q, items: [3–5 items in the CORRECT order], why }`
- `{ t: 'pipe', q, steps: [[GLYPH, name], ...] (3–5; glyph max 4 capital letters; first step may add 'src' as 3rd item), extra: [[GLYPH, name]] (exactly 1 block that does not belong), why }`
- `{ t: 'indent', step: 2, q, lang: 'yaml' | 'k8s' | 'ci' | 'compose', lines: [[spaces, text], ...] (the CORRECT indentation), why }`
- `{ t: 'check', q, a, w, why }` or with `code` + `lang`.

`lang`: `'shell'` (aws / gcloud / bq / dnf / systemctl / firewall-cmd / oc / podman commands), `'sql'` (Snowflake, BigQuery, generic SQL), `'yaml'`, `'k8s'` (Kubernetes / OpenShift manifests), `'python'`.

## Rules
- `a` not in `w`; the 3 `w` different, believable beginner mistakes, none "also right".
- `why`: 1–2 short sentences that teach (and name the common mistake).
- Simple English. Indian context welcome (Asha, Ravi, Lakshmi; Guntur, Pune; ₹).
- **Facts exactly as in the official docs.** Put `src: "official page URL"` on every card that states a checkable fact (the reviewer opens them). No made-up flags or output. **No prices, quotas, free-tier amounts or limits** (they change). No preview features.
- Safety: never real secrets; mention stopping unused resources where natural.
- **SQL that is plain/portable** (SELECT, WHERE, GROUP BY, JOIN…): add `verify: { setup: "CREATE TABLE …; INSERT …;", query: "…", rows: [[…]] }` so we can run it in SQLite. Snowflake/BigQuery-only statements (COPY INTO, CREATE WAREHOUSE, UNDROP, Time Travel AT/BEFORE…) are concept cards with `src`.
- Every YAML (learn code, indent lines, bug code after `fix`) must be valid YAML.

## Units (Basic level) and what to teach
**Data Engineering (`de`, vendor-neutral)**
- de.b.01 What a data engineer does — moves data from sources to where people use it; pipelines; sources (apps, files, APIs); consumers (analysts, dashboards, ML); data engineer vs data analyst vs data scientist.
- de.b.02 ETL vs ELT — extract, transform, load; ELT loads raw first and transforms inside the warehouse; when each fits.
- de.b.03 Batch vs streaming — scheduled chunks vs continuous events; latency; examples (nightly sales vs card fraud alerts).
- de.b.04 Warehouse, lake and lakehouse — structured tables for analytics vs raw files of any type vs lake files with table features (e.g. Delta, Iceberg); schema-on-write vs schema-on-read.
- de.b.05 Data modelling: star schema — fact table (events, numbers) and dimension tables (who/what/where/when); keys; why stars make reports simple and fast.
- de.b.06 Pipelines and scheduling — steps with dependencies (a DAG), schedules, retries, idempotent re-runs, alerts on failure; Apache Airflow as a common scheduler.

**Snowflake (`snow`)**
- snow.b.01 What Snowflake is — cloud data platform; storage and compute are separate; runs on AWS, Azure or Google Cloud; SQL.
- snow.b.02 Virtual warehouses — compute clusters that run queries; sizes; auto-suspend and auto-resume save cost; a warehouse is not where data is stored.
- snow.b.03 Databases, schemas and tables — object hierarchy `database.schema.table`; `CREATE DATABASE/SCHEMA/TABLE`; `USE`.
- snow.b.04 Loading data: stages and COPY INTO — internal/external stages, `PUT` (to an internal stage, from SnowSQL), `COPY INTO table FROM @stage`, file formats (CSV, JSON, Parquet).
- snow.b.05 Querying with SQL — SELECT, WHERE, ORDER BY, LIMIT, GROUP BY on Snowflake tables; fully qualified names; result cache idea (keep simple).
- snow.b.06 Time Travel and cloning — query past data with `AT`/`BEFORE`, `UNDROP TABLE`, zero-copy `CLONE` (no data copied at first).

**AWS (`aws`)**
- aws.b.01 Cloud, regions and Availability Zones — on-demand resources, pay for use; Regions contain multiple isolated AZs; choose a Region near users (e.g. Mumbai `ap-south-1`); some services are global (IAM).
- aws.b.02 IAM: users, groups and roles — root user (protect with MFA, don't use daily); users, groups, policies; roles for services/apps (temporary credentials); least privilege.
- aws.b.03 EC2: virtual servers — instances, AMI, instance type, key pair, security group (virtual firewall), stop vs terminate.
- aws.b.04 S3: storage — buckets and objects, keys, globally unique bucket names, Block Public Access, storage classes idea, `aws s3 cp`, `aws s3 ls`.
- aws.b.05 VPC: networking basics — VPC, subnets (public/private), internet gateway, route tables, security groups vs network ACLs (stateful vs stateless).
- aws.b.06 Billing and Free Tier safety — pay-as-you-go, AWS Budgets and billing alerts, stop/terminate unused resources, tags for cost; never share access keys; no amounts.

**Google Cloud (`gcp`)**
- gcp.b.01 Projects, regions and zones — everything lives in a project (ID, number, billing account); regions and zones; resource hierarchy (organization, folders, projects).
- gcp.b.02 IAM roles — principals, roles (basic, predefined, custom), grant on a resource; least privilege; service accounts.
- gcp.b.03 Compute Engine VMs — instances, machine types, images, zones, stop vs delete, firewall rules allow traffic; `gcloud compute instances create/list`.
- gcp.b.04 Cloud Storage buckets — buckets and objects, globally unique names, locations, storage classes idea, `gcloud storage cp` / `gcloud storage ls`, public access prevention.
- gcp.b.05 BigQuery basics — serverless data warehouse; datasets and tables `project.dataset.table`; standard SQL; pay attention to data scanned (select only needed columns; preview instead of SELECT *).
- gcp.b.06 Billing and budgets — billing account linked to projects, budgets and alerts, delete/stop unused resources, shut down a project.

**Red Hat (`rh`)**
- rh.b.01 RHEL and other Linux — RHEL is an enterprise Linux with subscription and support; related: Fedora (upstream), CentOS Stream; same Linux basics apply; `cat /etc/redhat-release` / `/etc/os-release`.
- rh.b.02 Packages with dnf — `dnf install/remove/update/search/info`, repositories, `dnf list installed`, why `sudo`; yum is the older name.
- rh.b.03 Services with systemctl — `systemctl start/stop/restart/status/enable/disable`, `enable --now`, units.
- rh.b.04 Firewall with firewalld — `firewall-cmd --state`, zones, `--add-service=http`, `--add-port=8080/tcp`, `--permanent` + `--reload`, `--list-all`.
- rh.b.05 SELinux basics — modes enforcing/permissive/disabled, `getenforce`, `setenforce 0` is temporary, labels/contexts `ls -Z`, don't disable it to "fix" problems; `restorecon`.
- rh.b.06 OpenShift: what it is — Red Hat's Kubernetes platform; projects (namespaces with more), `oc` CLI (`oc login`, `oc new-project`, `oc get pods`), web console, Routes expose apps.

## Units (Intermediate `i` and Advanced `a` levels): AWS and Google Cloud
Learners finished all Basic units of the same skill first; build on them. Intermediate = can do real tasks; Advanced = designs and production habits. Same card rules; `shell` for `aws` / `gcloud` / `bq` / `kubectl` / `terraform` commands, `yaml` for CloudFormation YAML, `k8s` for Kubernetes manifests, `text` for HCL (Terraform) or JSON policies.

**AWS (`aws`)**
- aws.i.07 RDS databases — managed relational DB (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora); AWS handles patching/backups; Multi-AZ (standby for failover) vs read replicas (scale reads); automated backups and snapshots; keep it in a private subnet; endpoint to connect.
- aws.i.08 Lambda (serverless) — run code without servers; triggers/events (S3 upload, API Gateway, schedule via EventBridge); handler function; pay per request and duration (no amounts); timeout and memory settings; execution role for permissions; stateless.
- aws.i.09 CloudWatch monitoring — metrics, alarms (alarm → SNS email), logs (log groups, log streams), dashboards; Lambda writes logs to CloudWatch Logs; CloudTrail records API calls (who did what) vs CloudWatch (how it performs).
- aws.i.10 Load balancers and Auto Scaling — Elastic Load Balancing: Application Load Balancer (HTTP/HTTPS, path rules) vs Network Load Balancer (TCP/UDP); target groups and health checks; Auto Scaling group (min/desired/max, launch template, scale out/in); spread across AZs.
- aws.i.11 AWS CLI — `aws configure` (profile, Region), `aws sts get-caller-identity`, `aws ec2 describe-instances`, `aws s3 sync`, `--region`, `--profile`, `--output table/json`, `--query`; never paste access keys in code; prefer roles / IAM Identity Center.
- aws.i.12 Data on AWS: Glue, Athena, Redshift — S3 as a data lake; Glue Data Catalog and crawlers, Glue ETL jobs; Athena runs SQL on files in S3 (pay per data scanned, partitions and columnar Parquet scan less); Redshift data warehouse; Kinesis for streams (one card).
- aws.a.13 CloudFormation — infrastructure as code; template (YAML/JSON), `Resources` (required), `Parameters`, `Outputs`; stack; change sets to preview; drift detection; delete the stack to remove all resources; `!Ref`, `!GetAtt`.
- aws.a.14 EKS (Kubernetes on AWS) — managed Kubernetes control plane; node groups / Fargate; `aws eks update-kubeconfig`, `kubectl get nodes`; ECR for images; IAM roles for service accounts / Pod Identity (one card); delete clusters after practice.
- aws.a.15 Security best practices — least privilege policies (JSON: Effect, Action, Resource), MFA, no long-term keys, roles; encryption with KMS; S3 Block Public Access; CloudTrail on; GuardDuty threat detection; Security Hub; Secrets Manager for secrets; shared responsibility model.
- aws.a.16 Well-Architected Framework — the six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability; Well-Architected Tool reviews; examples per pillar.

**Google Cloud (`gcp`)**
- gcp.i.07 VPC networks and firewall rules — global VPC, regional subnets, auto vs custom mode, firewall rules (direction, priority, targets via network tags or service accounts, implied deny ingress / allow egress), Cloud NAT for private VMs, `gcloud compute firewall-rules create`.
- gcp.i.08 Cloud Run — run containers serverless; services vs jobs; `gcloud run deploy --source .` or `--image`; scales to zero; revisions and traffic split; `--allow-unauthenticated` makes it public (warn); container must listen on `PORT`.
- gcp.i.09 Cloud SQL — managed MySQL, PostgreSQL, SQL Server; high availability (regional) vs read replicas; automated backups; private IP; Cloud SQL Auth Proxy / connectors; stop instance when not in use.
- gcp.i.10 Pub/Sub — topics, subscriptions, publishers, subscribers; pull vs push; ack; at-least-once delivery (handle duplicates); decouple services; `gcloud pubsub topics create`, `subscriptions create`.
- gcp.i.11 Dataflow — managed Apache Beam; batch and streaming pipelines; PCollections and transforms; templates; autoscaling workers; typical flow Pub/Sub → Dataflow → BigQuery; stop/drain jobs.
- gcp.i.12 gcloud CLI — `gcloud init`, `gcloud auth login`, `gcloud config set project`, `gcloud config list`, configurations, `--format`, `--filter`, `gcloud services enable`, `gcloud components`; `bq` and `gcloud storage` siblings; Cloud Shell.
- gcp.a.13 GKE (Kubernetes on Google Cloud) — Autopilot vs Standard; `gcloud container clusters create-auto`, `get-credentials`; `kubectl apply`; Artifact Registry for images; Workload Identity Federation for GKE; delete clusters after practice.
- gcp.a.14 Terraform on Google Cloud — HCL, `provider "google"`, `resource`, `terraform init/plan/apply/destroy`, state file (store remotely in a Cloud Storage bucket, never commit), variables; plan before apply.
- gcp.a.15 Security and organization policies — resource hierarchy inheritance of IAM; organization policy constraints (e.g. restrict public IPs, domain-restricted sharing); avoid service account keys; Secret Manager; Cloud Audit Logs; VPC Service Controls (one card); Security Command Center.

## Units (Intermediate `i` level): Data Engineering, Snowflake, Red Hat
Learners finished all Basic units of the same skill. Same card rules. Data Engineering: `sql` for SQL, `python` for PySpark/Airflow Python, `yaml` only for YAML. Snowflake: `sql`. Red Hat: `shell`, `k8s` for OpenShift manifests.

**Data Engineering (`de`)** — tool-neutral concepts first, tools named where standard (cite airflow.apache.org, spark.apache.org, parquet.apache.org, iceberg/delta docs only when needed)
- de.i.07 Data quality checks — not-null, unique, accepted values, referential (foreign key) checks, row counts vs source, freshness; fail the pipeline or quarantine bad rows; check early (before loading the warehouse). SQL checks with `verify`.
- de.i.08 Incremental loads and CDC — full vs incremental load; watermark column (e.g. `updated_at`) and saving the last value; upsert/MERGE; change data capture reads the database log (inserts, updates, deletes); deletes are missed by a simple watermark; idempotent reruns.
- de.i.09 Partitioning and file formats — CSV vs JSON vs Parquet (columnar, compressed, schema) vs Avro (row, good for streams); partition by date folders (`dt=2026-11-24/`); partition pruning reads less; too many small files is slow; pick a column queries filter on.
- de.i.10 Orchestration with Airflow — DAG, task, operator, schedule, dependencies `a >> b`, retries, backfill / catchup, idempotent tasks; Airflow schedules and watches, it should not do heavy data processing itself. Python DAG code must match the current Airflow 3 docs (`from airflow.sdk import DAG`, `schedule=`); mention that Airflow 2 used `from airflow import DAG`.
- de.i.11 Slowly changing dimensions — SCD Type 1 (overwrite, no history) vs Type 2 (new row with valid_from / valid_to / is_current); surrogate keys; fact rows join to the version valid at that time; Type 2 for history like a customer's city.
- de.i.12 Spark basics — distributed processing, driver and executors, DataFrame, lazy transformations vs actions (`count()`, `show()`, `write`), partitions, PySpark `spark.read.parquet`, `filter`, `groupBy().agg()`; shuffle is expensive.

**Snowflake (`snow`)** — cite docs.snowflake.com only
- snow.i.07 Roles and access control — RBAC: privileges granted to roles, roles granted to users; system roles ACCOUNTADMIN, SECURITYADMIN, SYSADMIN, USERADMIN, PUBLIC; `GRANT USAGE ON WAREHOUSE`, `GRANT SELECT ON TABLE ... TO ROLE`, `USE ROLE`; role hierarchy; don't use ACCOUNTADMIN for daily work.
- snow.i.08 Semi-structured data (VARIANT) — load JSON into a VARIANT column; path syntax `col:customer.name`, cast with `::string`; `FLATTEN` with `LATERAL` for arrays; `PARSE_JSON`.
- snow.i.09 Snowpipe — continuous loading of files from a stage as they arrive; `CREATE PIPE ... AS COPY INTO`; auto-ingest with cloud event notifications; serverless (no warehouse of yours); vs bulk COPY INTO on a schedule.
- snow.i.10 Streams and tasks — a stream records changes (inserts, updates, deletes) on a table (`METADATA$ACTION`); a task runs SQL on a schedule (`SCHEDULE`) or after another task; tasks start suspended → `ALTER TASK ... RESUME`; stream + task + MERGE = simple incremental pipeline.
- snow.i.11 Performance and caching — result cache (same query, unchanged data), warehouse (local disk) cache, micro-partitions and pruning, clustering keys for very large tables, Query Profile; scale up (bigger size) for complex queries vs scale out (multi-cluster) for many users.
- snow.i.12 Cost control — credits used by warehouses while running; AUTO_SUSPEND and AUTO_RESUME; right-size warehouses; resource monitors (notify / suspend at a quota); serverless features also use credits; no prices.

**Red Hat (`rh`)** — cite docs.redhat.com (RHEL 9) and docs.openshift.com / docs.redhat.com OpenShift
- rh.i.07 Users, groups and sudo — `useradd`, `passwd`, `usermod -aG wheel`, `groupadd`, `id`; /etc/passwd vs /etc/shadow; the `wheel` group gets sudo on RHEL; `visudo`; avoid logging in as root.
- rh.i.08 Storage: LVM and file systems — physical volume → volume group → logical volume (`pvcreate`, `vgcreate`, `lvcreate`); `mkfs.xfs` (XFS is the RHEL default); mount and `/etc/fstab` (use UUID); `lvextend -r` to grow; `lsblk`, `df -h`.
- rh.i.09 Logs with journalctl — systemd journal; `journalctl -u sshd`, `-f`, `-p err`, `--since`, `-b`; persistent journal (`/var/log/journal`); rsyslog and /var/log/messages also exist.
- rh.i.10 Podman containers — daemonless, rootless; `podman run -d -p 8080:80`, `podman ps`, `podman logs`, `podman images`; UBI images from registry.access.redhat.com; Docker-compatible commands; run as a systemd service (Quadlet, one card).
- rh.i.11 OpenShift projects and the oc CLI — `oc login`, `oc new-project`, `oc project`, `oc get pods`, `oc logs`, `oc describe`; a project is a Kubernetes namespace with extra features; web console; `oc` vs `kubectl`.
- rh.i.12 Deploying an app on OpenShift — `oc new-app` (from image or Git source, Source-to-Image), Deployment, Service, Route to expose (`oc expose service`), scale with `oc scale`; containers run as a random non-root user by default (restricted SCC).
