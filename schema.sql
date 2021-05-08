-- Drop table if exists
drop table if exists dinosaur_fossils;

create table dinosaur_fossils  (
	specimen_no int primary key,
	specimen_id text,
	specimen_part text,
	specimen_name text,
	specimen_phylum text,
	specimen_class text,
	specimen_family text,
	specimen_genus text,
	lng int,
	lat int,
	country text,
	state text); 

select * from dinosaur_fossils;