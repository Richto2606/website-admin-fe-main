'use client';

import { createTitleAndBreadcrumbs, dashboardString, dashboardUrl } from "@constant/breadcrumbs";
import { DataStaticCardProps } from "@interfaces/interface-items";
import Breadcumbs from "@ui/breadcrumbs";
import { useQueryClient } from "./hook";
import { useEffect, useRef, useState, useMemo } from "react";
import DashboardCard from "@components/particel/dashboard-card";
import ChartCard from "@components/particel/dashboard-chart";
import DynamicCard from "@components/particel/dynamic-card";
import { 
  Select, 
  SelectTrigger, 
  SelectValue,
  SelectContent, 
  SelectItem 
} from "@components/select";
import { formatCurrency } from "@utils/format";

const bulan = [
  { value: 1, text: 'Januari' },
  { value: 2, text: 'Februari' },
  { value: 3, text: 'Maret' },
  { value: 4, text: 'April' },
  { value: 5, text: 'Mei' },
  { value: 6, text: 'Juni' },
  { value: 7, text: 'Juli' },
  { value: 8, text: 'Agustus' },
  { value: 9, text: 'September' },
  { value: 10, text: 'Oktober' },
  { value: 11, text: 'November' },
  { value: 12, text: 'Desember' },
];

export default function DashboardPage() {
  const weeklyLabels = useMemo(() => ['Minggu Ke-1', 'Minggu Ke-2', 'Minggu Ke-3', 'Minggu Ke-4'], []);

  const { activeResidents, kamarTerpakai, pemasukanBulanan, pengeluranBulanan, sinkronisasiPayment } = useQueryClient();
  const [penghuni, setPenghuni] = useState<DataStaticCardProps[]>([]);
  const [kamar, setKamar] = useState<DataStaticCardProps[]>([]);
  const [pemasukan, setPemasukan] = useState<number[]>([]);
  const [pengeluran, setPengeluran] = useState<number[]>([]);
  const [pendapatan, setPendapatan] = useState<number>(0);
  const [sinkronisasi, setSinkronisasi] = useState<number>(0);
  const [monthPemasukan, setMonthPemasukan] = useState<number>(new Date().getMonth() + 1); 
  const [monthPengeluaran, setMonthPengeluaran] = useState<number>(new Date().getMonth() + 1); 

  const isInitialMount = useRef(true);
  const hasFetchedInitial = useRef(false);

  // Initial fetch for all data
  useEffect(() => {
    if (hasFetchedInitial.current) return;
    const controller = new AbortController();

    const fetchInitialData = async () => {
      try {
        const [resResidents, resKamar, resPemasukan, resPengeluaran, resSinkronisasi] = await Promise.all([
          activeResidents(undefined, controller.signal),
          kamarTerpakai(undefined, controller.signal),
          pemasukanBulanan(monthPemasukan, undefined, controller.signal),
          pengeluranBulanan(monthPengeluaran, undefined, controller.signal),
          sinkronisasiPayment(undefined, controller.signal)
        ]);

        // Jika salah satu request mengembalikan null karena 401 atau dibatalkan, jangan lanjutkan set state
        if (controller.signal.aborted) return;

        if (resResidents) {
          setPenghuni([
            { name: "Total", count: resResidents.data_count, fill: "white" },
            { name: "Penghuni", count: resResidents.data_active, fill: "#2280CC" }
          ]);
        }
        if (resKamar) {
          setKamar([
            { name: "Total", count: resKamar.data_count, fill: "white" },
            { name: "Kamar", count: resKamar.data_active, fill: "#2280CC" }
          ]);
        }
        if (resPemasukan) {
          setPemasukan(resPemasukan.weekly_income);
          setPendapatan(prev => prev + resPemasukan.total_income);
        }
        if (resPengeluaran) {
          setPengeluran(resPengeluaran.weekly_outcome);
          setPendapatan(prev => prev - resPengeluaran.total_outcome);
        }
        if (resSinkronisasi) {
          setSinkronisasi(resSinkronisasi.data_active);
        }
        hasFetchedInitial.current = true;
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          console.error("Error fetching initial dashboard data:", error);
        }
      }
    };

    fetchInitialData();

    return () => {
      controller.abort();
    };
  }, [activeResidents, kamarTerpakai, pemasukanBulanan, pengeluranBulanan, sinkronisasiPayment, monthPemasukan, monthPengeluaran]);

  // Subsequent fetch for month changes (Income)
  useEffect(() => {
    if (isInitialMount.current) return;
    const controller = new AbortController();
    
    const fetchNewPemasukan = async () => {
      try {
        const datas = await pemasukanBulanan(monthPemasukan, undefined, controller.signal);
        if (datas && !controller.signal.aborted) {
          setPemasukan(datas.weekly_income);
        }
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          console.error("Error fetching monthly income:", error);
        }
      }
    };

    fetchNewPemasukan();

    return () => {
      controller.abort();
    };
  }, [monthPemasukan, pemasukanBulanan]);

  // Subsequent fetch for month changes (Outcome)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const controller = new AbortController();

    const fetchNewPengeluaran = async () => {
      try {
        const datas = await pengeluranBulanan(monthPengeluaran, undefined, controller.signal);
        if (datas && !controller.signal.aborted) {
          setPengeluran(datas.weekly_outcome);
        }
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          console.error("Error fetching monthly outcome:", error);
        }
      }
    };

    fetchNewPengeluaran();

    return () => {
      controller.abort();
    };
  }, [monthPengeluaran, pengeluranBulanan]);


  const handleMonthPemasukanChange = (value: string) => {
    setMonthPemasukan(parseInt(value, 10));
  };
  const handleMonthPengeluaranChange = (value: string) => {
    setMonthPengeluaran(parseInt(value, 10));
  };
  const breadcrumbs = createTitleAndBreadcrumbs(dashboardString, dashboardUrl);
  return (
    <div className='container max-w-screen-xl mx-auto px-4'>
      <Breadcumbs title={breadcrumbs.mainTitle} breadCrumbs={breadcrumbs.breadCrumbsMain} />
      <div className="flex flex-col space-y-4 mt-2">
        <div className="grid grid-cols-4 gap-4">
          <DashboardCard 
            title="Total Penghuni Asrama"
            subtitle="Penghuni Aktif"
            isBar={true}
            value={penghuni[1]?.count || 0} 
            total={penghuni[0]?.count || 0} 
            colorMain="#2280CC"
            detailLink="/residents"
          />
          <DashboardCard 
            title="Total Kamar" 
            subtitle="Kamar Terpakai"
            isBar={true}
            value={kamar[1]?.count || 0} 
            total={kamar[0]?.count || 0} 
            colorMain="#E66969"
            detailLink="#" 
          />
          <DashboardCard 
            title="Total Pendapatan Bulan Ini" 
            subtitle="Pemasukan"
            isBar={false}
            value={formatCurrency(pendapatan.toString() || '')} 
            total="" 
            colorMain="#1DBB6C"
            detailLink="/reports"
          />
          <DashboardCard 
            title="Menunggu Validasi" 
            subtitle="Total Laporan Pembayaran"
            isBar={false}
            value={sinkronisasi} 
            total="Total Laporan Pembayaran" 
            colorMain="#E6AA06"
            detailLink="/payments" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DynamicCard 
            header={
              <div className='flex p-4 justify-between'>
                <div className="w-[50%]">
                  <span>Total Pemasukan Bulanan</span>
                </div>
                <div className="w-[50%]">
                  <Select value={monthPemasukan.toString()} onValueChange={handleMonthPemasukanChange}>
                    <SelectTrigger aria-label={`pemasukan`} className=" bg-transparent">
                      <SelectValue placeholder={'Pilih bulan'} />
                    </SelectTrigger>
                    <SelectContent>
                      {bulan.map((item, index) => (
                        <SelectItem value={item.value.toString()} key={index}>
                          {item.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
            border={true}
            body={
              <ChartCard
                data={pemasukan || []} 
                labels={weeklyLabels} 
              />
            }
          />
          
          <DynamicCard 
            header={
              <div className='flex p-4 justify-between'>
                <div className="w-[50%]">
                  <span>Total Pengeluaran Bulanan</span>
                </div>
                <div className="w-[50%]">
                  <Select value={monthPengeluaran.toString()} onValueChange={handleMonthPengeluaranChange}>
                  <SelectTrigger aria-label={`pemasukan`} className=" bg-transparent">
                    <SelectValue placeholder={'Pilih bulan'} />
                  </SelectTrigger>
                  <SelectContent>
                    {bulan.map((item, index) => (
                      <SelectItem value={item.value.toString()} key={index}>
                        {item.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              </div>
            }
            border={true}
            body={
              <ChartCard 
                data={pengeluran || []} 
                labels={weeklyLabels} 
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
