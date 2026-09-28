-- Backs sequential invoice numbering (INV-3000, INV-3001, ...) for the POS checkout flow.
CREATE SEQUENCE invoice_number_seq START WITH 3000 INCREMENT BY 1;
