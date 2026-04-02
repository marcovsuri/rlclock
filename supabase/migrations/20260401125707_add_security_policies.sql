alter table "public"."menus" enable row level security;

alter table "public"."schedules" enable row level security;

create policy "Enable read access for all users"
on "public"."announcements"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."exams"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."menus"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."schedules"
as permissive
for select
to public
using (true);



