drop policy "Public read access to exams" on "public"."exams";

create table "public"."serviceData" (
    "last_updated" timestamp with time zone not null default now(),
    "numDonations" bigint not null,
    "donationGoal" bigint not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."serviceData" enable row level security;

create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "blackbaud_id" text not null,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "access_token" text not null,
    "refresh_token" text not null,
    "access_token_expiration" timestamp with time zone not null
);


alter table "public"."users" enable row level security;

alter table "public"."announcements" enable row level security;

CREATE UNIQUE INDEX "serviceData_id_key" ON public."serviceData" USING btree (id);

CREATE UNIQUE INDEX "serviceData_pkey" ON public."serviceData" USING btree (id);

CREATE UNIQUE INDEX users_blackbaud_id_key ON public.users USING btree (blackbaud_id);

CREATE UNIQUE INDEX users_id_key ON public.users USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."serviceData" add constraint "serviceData_pkey" PRIMARY KEY using index "serviceData_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."serviceData" add constraint "serviceData_id_key" UNIQUE using index "serviceData_id_key";

alter table "public"."users" add constraint "users_blackbaud_id_key" UNIQUE using index "users_blackbaud_id_key";

alter table "public"."users" add constraint "users_id_key" UNIQUE using index "users_id_key";

grant delete on table "public"."serviceData" to "anon";

grant insert on table "public"."serviceData" to "anon";

grant references on table "public"."serviceData" to "anon";

grant select on table "public"."serviceData" to "anon";

grant trigger on table "public"."serviceData" to "anon";

grant truncate on table "public"."serviceData" to "anon";

grant update on table "public"."serviceData" to "anon";

grant delete on table "public"."serviceData" to "authenticated";

grant insert on table "public"."serviceData" to "authenticated";

grant references on table "public"."serviceData" to "authenticated";

grant select on table "public"."serviceData" to "authenticated";

grant trigger on table "public"."serviceData" to "authenticated";

grant truncate on table "public"."serviceData" to "authenticated";

grant update on table "public"."serviceData" to "authenticated";

grant delete on table "public"."serviceData" to "service_role";

grant insert on table "public"."serviceData" to "service_role";

grant references on table "public"."serviceData" to "service_role";

grant select on table "public"."serviceData" to "service_role";

grant trigger on table "public"."serviceData" to "service_role";

grant truncate on table "public"."serviceData" to "service_role";

grant update on table "public"."serviceData" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable read access for all users"
on "public"."serviceData"
as permissive
for select
to public
using (true);



