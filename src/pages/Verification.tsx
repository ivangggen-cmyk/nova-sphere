import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Clock, Upload, FileImage, Camera } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Verification = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const isVerified = profile?.is_verified || false;
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [docType, setDocType] = useState("passport");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("verification_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setRequests(data || []));
  }, [user]);

  const hasPending = requests.some(r => r.status === "pending");

  const submitVerification = async () => {
    if (!user || !docFile) {
      toast({ title: "Прикрепите документ", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const docPath = `${user.id}/doc_${Date.now()}.${docFile.name.split('.').pop()}`;
      const { error: docErr } = await supabase.storage.from("verification-docs").upload(docPath, docFile);
      if (docErr) throw docErr;
      const { data: docUrl } = supabase.storage.from("verification-docs").getPublicUrl(docPath);

      let selfieUrl = "";
      if (selfieFile) {
        const selfiePath = `${user.id}/selfie_${Date.now()}.${selfieFile.name.split('.').pop()}`;
        const { error: selfieErr } = await supabase.storage.from("verification-docs").upload(selfiePath, selfieFile);
        if (selfieErr) throw selfieErr;
        const { data: sUrl } = supabase.storage.from("verification-docs").getPublicUrl(selfiePath);
        selfieUrl = sUrl.publicUrl;
      }

      const { data, error } = await supabase.from("verification_requests").insert({
        user_id: user.id,
        full_name: fullName,
        document_type: docType,
        document_url: docUrl.publicUrl,
        selfie_url: selfieUrl,
      } as any).select();
      if (error) throw error;

      setRequests(prev => [data![0], ...prev]);
      setDocFile(null);
      setSelfieFile(null);
      toast({ title: "Заявка на верификацию отправлена!" });
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Верификация</h1>
        <p className="text-sm text-muted-foreground">Подтвердите личность для доступа к заданиям с высоким вознаграждением</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Статус верификации</h3>
            <p className="text-sm text-muted-foreground">
              {isVerified ? "Ваш аккаунт верифицирован" : hasPending ? "Заявка на рассмотрении" : "Ожидает верификации"}
            </p>
          </div>
          <Badge className={`ml-auto border-0 ${isVerified ? "bg-success/10 text-success" : hasPending ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-accent/10 text-accent"}`}>
            {isVerified ? "Верифицирован" : hasPending ? "На рассмотрении" : "Не верифицирован"}
          </Badge>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isVerified ? "100%" : hasPending ? "50%" : "0%" }}
            transition={{ duration: 0.8 }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </motion.div>

      {isVerified ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold mb-2">Аккаунт верифицирован</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Вам доступны все задания платформы, включая задания с высоким вознаграждением.
          </p>
        </motion.div>
      ) : (
        <>
          {!hasPending && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-display font-semibold mb-4">Подать заявку на верификацию</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs">Полное имя (как в документе)</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" placeholder="Иванов Иван Иванович" />
                </div>
                <div>
                  <Label className="text-xs">Тип документа</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Паспорт РФ</SelectItem>
                      <SelectItem value="foreign_passport">Загранпаспорт</SelectItem>
                      <SelectItem value="driver_license">Водительское удостоверение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-xs mb-2 block">Фото документа</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    {docFile ? (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <FileImage className="h-5 w-5 text-primary" />
                        {docFile.name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="h-6 w-6" />
                        <span className="text-xs">Нажмите для загрузки</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setDocFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Селфи с документом (рекомендуется)</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    {selfieFile ? (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Camera className="h-5 w-5 text-primary" />
                        {selfieFile.name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Camera className="h-6 w-6" />
                        <span className="text-xs">Нажмите для загрузки</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>

              <Button className="gradient-primary text-primary-foreground border-0" onClick={submitVerification} disabled={loading}>
                {loading ? "Отправка..." : "Отправить заявку"}
              </Button>
            </motion.div>
          )}

          {/* Previous requests */}
          {requests.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold mb-4">История заявок</h3>
              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div>
                      <div className="text-sm font-medium">{r.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.document_type === "passport" ? "Паспорт РФ" : r.document_type === "foreign_passport" ? "Загранпаспорт" : "ВУ"} · {new Date(r.created_at).toLocaleDateString("ru-RU")}
                      </div>
                      {r.admin_notes && <div className="text-xs text-muted-foreground mt-1">Комментарий: {r.admin_notes}</div>}
                    </div>
                    <Badge className={`border-0 ${r.status === "approved" ? "bg-success/10 text-success" : r.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}>
                      {r.status === "approved" ? "Одобрено" : r.status === "rejected" ? "Отклонено" : "На рассмотрении"}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Verification;
